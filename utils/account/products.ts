import axios from 'axios';
import { errorHandler } from '../../middleware/errors';
import { ListProducts } from '../../types/productsNew';
import { parseAsNumber, safelyParse } from '../parsers';

const URL = process.env.NEXT_PUBLIC_SITE_URL || '';

export function convertCost(cost: number): string {
    return `£${cost / 10}`;
}

export async function addProduct(
    sku: string,
    userId: string | null,
    title: string,
    slug: string,
    content: string,
    mainImage: string | null,
    gallery: string[] | null,
    productType: string,
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
            productType,
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

export async function listProducts(count: number, page: number): Promise<ListProducts> {
    try {
        const res = await axios.get(`${URL}/api/products/list`, {
            params: {
                count,
                page,
            },
        });

        return res.data;
    } catch (error: unknown) {
        errorHandler(error, 'Could not list products.');
    }

    return { products: [], count: 0 };
}

export async function deleteProduct(id: string): Promise<boolean> {
    try {
        const res = await axios.delete(`${URL}/api/products/delete`, {
            data: {
                id,
            },
        });
        const status = safelyParse(res, 'status', parseAsNumber, 500);

        return status === 204;
    } catch (error: unknown) {
        errorHandler(error, 'Could not delete product.');
    }

    return false;
}

export async function addImageToBucket(file: File, slug: string): Promise<string | null> {
    try {
        const fileName = `products/${slug}/${file.name}`;
        const imageUrlRes = await axios.get('/api/images/upload', {
            params: {
                file: fileName,
                fileType: file.type,
            },
        });

        const { url, fields } = await imageUrlRes.data;
        const formData = new FormData();

        Object.entries({ ...fields, file }).forEach(([key, value]) => {
            formData.append(key, value as string);
        });

        await axios.post(url, formData);

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
