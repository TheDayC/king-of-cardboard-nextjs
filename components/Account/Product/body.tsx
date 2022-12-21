import React, { useEffect, useState } from 'react';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import { BsFillCartCheckFill, BsBoxSeam, BsCurrencyPound } from 'react-icons/bs';
import { MdOutlineTitle } from 'react-icons/md';
import { ImFontSize } from 'react-icons/im';
import { AiOutlineBarcode, AiOutlinePoundCircle } from 'react-icons/ai';
import { FaBoxes } from 'react-icons/fa';
import { toNumber } from 'lodash';
import { BiSave } from 'react-icons/bi';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { useDispatch } from 'react-redux';

import InputField from './Input';
import { parseAsString, safelyParse } from '../../../utils/parsers';
import RichTextEditor from '../../RichTextEditor';
import SelectField from './Select';
import { ProductType } from '../../../enums/products';
import { addGalleryToBucket, addImageToBucket, addProduct, editProduct } from '../../../utils/account/products';
import { addError, addSuccess } from '../../../store/slices/alerts';
import ImageUpload from './ImageUpload';

const productTypes = [
    { key: 'Sealed', value: ProductType.Sealed },
    { key: 'Singles', value: ProductType.Singles },
    { key: 'Packs', value: ProductType.Packs },
    { key: 'Other', value: ProductType.Other },
];

interface ProductBodyProps {
    _id?: string;
    sku?: string;
    created?: string;
    lastUpdated?: string;
    title?: string;
    slug?: string;
    content?: string;
    mainImage?: string;
    gallery?: string[] | null;
    productType?: ProductType;
    quantity?: number | null;
    price?: number;
    salePrice?: number;
    isInfinite?: boolean;
    isNew: boolean;
}

export const ProductBody: React.FC<ProductBodyProps> = ({
    _id,
    sku,
    title,
    slug,
    content: existingContent,
    mainImage,
    gallery,
    productType,
    quantity,
    price,
    salePrice,
    isNew,
}) => {
    const { data: session } = useSession();
    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        setError,
        reset,
        getValues,
    } = useForm();
    const router = useRouter();
    const { content } = getValues();
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(false);
    const [mainImageFileList, setMainImageFileList] = useState<FileList | null>(null);
    const [galleryFileList, setGalleryFileList] = useState<FileList | null>(null);

    // Errors
    const hasErrors = Object.keys(errors).length > 0;
    const titleErr = safelyParse(errors, 'title.message', parseAsString, null);
    const slugErr = safelyParse(errors, 'slug.message', parseAsString, null);
    const skuErr = safelyParse(errors, 'sku.message', parseAsString, null);
    const typeErr = safelyParse(errors, 'productType.message', parseAsString, null);
    const qtyErr = safelyParse(errors, 'quantity.message', parseAsString, null);
    const priceErr = safelyParse(errors, 'price.message', parseAsString, null);
    const salePriceErr = safelyParse(errors, 'salePrice.message', parseAsString, null);
    const mainImageErr = safelyParse(errors, 'mainImage.message', parseAsString, null);
    const galleryErr = safelyParse(errors, 'gallery.message', parseAsString, null);

    // Variables
    const userId = session ? session.user.id : null;

    const onSubmit: SubmitHandler<FieldValues> = async (data: FieldValues) => {
        if (hasErrors || isLoading) {
            return;
        }

        setIsLoading(true);

        const { sku, slug, title, content, productType, quantity, price, salePrice } = data;
        let fileName: string | null = mainImage ?? null;
        let galleryFileNames: string[] | null = gallery ?? null;

        // Upload the main image.
        if (mainImageFileList) {
            const file = mainImageFileList[0];

            fileName = await addImageToBucket(file, slug);

            if (!fileName) {
                setError('mainImage', {
                    type: 'custom',
                    message: 'Could not upload main image.',
                });

                setIsLoading(false);
                return;
            }
        }

        // Upload gallery images
        if (galleryFileList) {
            galleryFileNames = await addGalleryToBucket(galleryFileList, slug);

            if (!galleryFileNames) {
                setError('gallery', {
                    type: 'custom',
                    message: 'Could not upload gallery images.',
                });

                setIsLoading(false);
                return;
            }
        }

        if (isNew) {
            const hasAddedProduct = await addProduct(
                sku,
                userId,
                title,
                slug,
                content,
                fileName,
                galleryFileNames,
                productType,
                toNumber(quantity),
                toNumber(price),
                toNumber(salePrice),
                false
            );

            if (hasAddedProduct) {
                dispatch(addSuccess('Product added!'));
            } else {
                dispatch(addError('Product already exists.'));
            }
            reset();
            handleRichContent(undefined);
            router.push('/account/products');
        } else {
            const hasEditedProduct = await editProduct(_id || '', {
                sku,
                userId,
                title,
                slug,
                content,
                mainImage: fileName,
                gallery: galleryFileNames,
                productType: toNumber(productType),
                quantity: toNumber(quantity),
                price: toNumber(price),
                salePrice: toNumber(salePrice),
                isInfinite: false,
            });

            if (hasEditedProduct) {
                dispatch(addSuccess('Product saved!'));
            } else {
                dispatch(addError('Product could not be saved.'));
            }
        }

        setIsLoading(false);
    };

    const handleRichContent = (content?: string) => {
        setValue('content', content);
    };

    useEffect(() => {
        register('content');
    }, [register]);

    useEffect(() => {
        setValue('content', existingContent);
    }, [existingContent, setValue]);

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col space-y-4">
                <div className="flex flex-row space-x-4 items-start justify-start">
                    <InputField
                        placeholder="Title"
                        fieldName="title"
                        instruction="Title is required."
                        error={titleErr}
                        register={register}
                        Icon={MdOutlineTitle}
                        defaultValue={title}
                        isRequired
                    />
                    <InputField
                        placeholder="Slug"
                        fieldName="slug"
                        instruction="Slug is required."
                        error={slugErr}
                        register={register}
                        Icon={ImFontSize}
                        defaultValue={slug}
                        isRequired
                    />
                    <InputField
                        placeholder="SKU"
                        fieldName="sku"
                        instruction="SKU is required."
                        error={skuErr}
                        register={register}
                        Icon={AiOutlineBarcode}
                        defaultValue={sku}
                        isRequired
                    />
                    <SelectField
                        placeholder="Product type"
                        fieldName="productType"
                        instruction="Product type is required."
                        options={productTypes}
                        error={typeErr}
                        register={register}
                        defaultValue={productType}
                        Icon={BsBoxSeam}
                    />
                </div>
                <div className="flex flex-row space-x-4 items-start justify-start">
                    <InputField
                        placeholder="Quantity"
                        fieldName="quantity"
                        fieldType="number"
                        instruction="Quantity is required."
                        error={qtyErr}
                        register={register}
                        Icon={FaBoxes}
                        defaultValue={quantity || undefined}
                        isRequired
                    />
                    <InputField
                        placeholder="Price in pennies"
                        fieldName="price"
                        fieldType="number"
                        instruction="Price is required."
                        error={priceErr}
                        register={register}
                        Icon={BsCurrencyPound}
                        defaultValue={price || undefined}
                        isRequired
                    />
                    <InputField
                        placeholder="Sale price in pennies"
                        fieldName="salePrice"
                        fieldType="number"
                        instruction="Sale price is required."
                        error={salePriceErr}
                        register={register}
                        Icon={AiOutlinePoundCircle}
                        defaultValue={salePrice || undefined}
                        isRequired={false}
                    />
                </div>
                <div className="flex flex-row space-x-4 w-full">
                    <div className="w-1/2">
                        <ImageUpload
                            fieldName="mainImage"
                            title="Main image"
                            label="Select main image"
                            isRequired={false}
                            isMultiple={false}
                            error={mainImageErr}
                            register={register}
                            currentImages={mainImage}
                            setFileList={setMainImageFileList}
                        />
                    </div>
                    <div className="w-1/2">
                        <ImageUpload
                            fieldName="gallery"
                            title="Gallery images"
                            label="Select gallery images"
                            isRequired={false}
                            isMultiple
                            error={galleryErr}
                            register={register}
                            currentImages={gallery || undefined}
                            setFileList={setGalleryFileList}
                        />
                    </div>
                </div>
                <div className="flex flex-col">
                    <RichTextEditor placeholder="Content" onChange={handleRichContent} value={content as string} />
                </div>

                <div className="form-control">
                    <button
                        type="submit"
                        className={`btn btn-block btn-primary rounded-md${isLoading ? ' loading' : ''}`}
                    >
                        {!isLoading && (
                            <React.Fragment>
                                {isNew ? (
                                    <React.Fragment>
                                        <BsFillCartCheckFill className="inline-block text-xl mr-2" />
                                        Add Product
                                    </React.Fragment>
                                ) : (
                                    <React.Fragment>
                                        <BiSave className="inline-block text-xl mr-2" />
                                        Save Product
                                    </React.Fragment>
                                )}
                            </React.Fragment>
                        )}
                    </button>
                </div>
            </div>
        </form>
    );
};

export default ProductBody;
