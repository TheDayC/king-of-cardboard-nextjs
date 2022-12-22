import axios from 'axios';
import { Upload } from '@aws-sdk/lib-storage';

import { s3Client } from '../../lib/aws';
import { errorHandler } from '../../middleware/errors';
import { ListProducts, Product } from '../../types/productsNew';
import { parseAsNumber, safelyParse } from '../parsers';
import { Category, Configuration, Interest } from '../../enums/products';

const URL = process.env.NEXT_PUBLIC_SITE_URL || '';

export function getPrettyPrice(cost: number): string {
    return `£${cost / 100}`;
}

export async function addProduct(
    sku: string,
    userId: string | null,
    title: string,
    slug: string,
    content: string,
    mainImage: string | null,
    gallery: string[] | null,
    category: number,
    configuration: number,
    interest: number,
    quantity: number,
    price: number,
    salePrice: number,
    isInfinite: boolean
): Promise<boolean> {
    try {
        const res = await axios.post(`${URL}/api/products/add`, {
            sku,
            userId,
            title,
            slug,
            content,
            mainImage,
            gallery,
            category,
            configuration,
            interest,
            quantity,
            price,
            salePrice,
            isInfinite,
        });
        const status = safelyParse(res, 'status', parseAsNumber, 400);

        return status === 201;
    } catch (error: unknown) {
        errorHandler(error, 'Could not add product.');
    }

    return false;
}

export async function listProducts(
    count: number,
    page: number,
    categories?: Category[],
    configurations?: Configuration[],
    interests?: Interest[]
): Promise<ListProducts> {
    try {
        const res = await axios.get(`${URL}/api/products/list`, {
            params: {
                count,
                page,
                categories,
                configurations,
                interests,
            },
        });

        return res.data;
    } catch (error: unknown) {
        errorHandler(error, 'Could not list products.');
    }

    return { products: [], count: 0 };
}

export async function deleteProduct(key: string): Promise<boolean> {
    try {
        const res = await axios.delete(`${URL}/api/products/delete`, {
            data: {
                key,
            },
        });
        const status = safelyParse(res, 'status', parseAsNumber, 500);

        return status === 204;
    } catch (error: unknown) {
        errorHandler(error, 'Could not delete product.');
    }

    return false;
}

export async function editProduct(id: string, options: any): Promise<boolean> {
    try {
        const res = await axios.put(`${URL}/api/products/edit`, {
            ...options,
            id,
        });
        const status = safelyParse(res, 'status', parseAsNumber, 500);

        return status === 204;
    } catch (error: unknown) {
        errorHandler(error, 'Could not delete product.');
    }

    return false;
}

export async function getProduct(id: string): Promise<Product | null> {
    try {
        const res = await axios.get(`${URL}/api/products/get`, {
            params: {
                id,
            },
        });

        return res.data as Product;
    } catch (error: unknown) {
        errorHandler(error, 'Could not get product.');
    }

    return null;
}

export async function addImageToBucket(file: File, slug: string): Promise<string | null> {
    try {
        const fileName = `products/${slug}/${file.name}`;

        const parallelUploads3 = new Upload({
            client: s3Client,
            params: {
                Bucket: process.env.NEXT_PUBLIC_AWS_BUCKET_NAME,
                Key: fileName,
                Body: file,
                ContentType: file.type,
            },
            queueSize: 4, // optional concurrency configuration
            partSize: 1024 * 1024 * 5, // optional size of each part, in bytes, at least 5MB
            leavePartsOnError: false, // optional manually handle dropped parts
        });

        parallelUploads3.on('httpUploadProgress', (progress) => {
            console.log(progress);
        });

        await parallelUploads3.done();

        return fileName;
    } catch (err) {
        return null;
    }
}

export async function addGalleryToBucket(imageFiles: FileList, slug: string): Promise<string[] | null> {
    try {
        const images = Array.from(imageFiles as FileList);
        const fileNames: string[] = [];

        for (const image of images) {
            const fileName = await addImageToBucket(image, slug);

            if (fileName) fileNames.push(fileName);
        }

        return fileNames;
    } catch (err) {
        return null;
    }
}

export async function deleteImageFromBucket(key: string): Promise<boolean> {
    try {
        const res = await axios.delete('/api/images/delete', {
            params: {
                key,
            },
        });
        const status = safelyParse(res, 'status', parseAsNumber, 500);

        return status === 204;
    } catch (err) {
        return false;
    }
}
