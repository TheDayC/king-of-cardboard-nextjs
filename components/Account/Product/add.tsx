import React, { useEffect, useState } from 'react';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import { BsFillCartCheckFill, BsBoxSeam, BsCurrencyPound } from 'react-icons/bs';
import { MdOutlineTitle } from 'react-icons/md';
import { ImFontSize } from 'react-icons/im';
import { AiOutlineBarcode, AiOutlinePoundCircle } from 'react-icons/ai';
import { FaBoxes } from 'react-icons/fa';
import { toNumber, uniq } from 'lodash';

import InputField from './Input';
import { parseAsString, safelyParse } from '../../../utils/parsers';
import RichTextEditor from '../../RichTextEditor';
import SelectField from './Select';
import { ProductType } from '../../../enums/products';
import { addGalleryToBucket, addImageToBucket, addProduct } from '../../../utils/account/products';
import { useSession } from 'next-auth/react';
import { useDispatch } from 'react-redux';
import { addError, addSuccess } from '../../../store/slices/alerts';
import ImageUpload from './ImageUpload';

const productTypes = [
    { key: 'Sealed', value: ProductType.Sealed },
    { key: 'Singles', value: ProductType.Singles },
    { key: 'Packs', value: ProductType.Packs },
    { key: 'Other', value: ProductType.Other },
];

export const AddProduct: React.FC = () => {
    const { data: session } = useSession();
    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        setError,
    } = useForm();
    const dispatch = useDispatch();
    const [mainImage, setMainImage] = useState<string | null>(null);
    const [gallery, setGallery] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [hasAddedProduct, setHasAddedProduct] = useState<boolean | null>(null);

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
        setHasAddedProduct(null);
        const { sku, slug, title, content, productType, quantity, price, salePrice } = data;
        const file = data.mainImage[0] as File; // Don't conflict with gallery mainImage.
        const galleryFileList = data.gallery as FileList; // Don't conflict with gallery state.

        // Upload the main image.
        const fileName = await addImageToBucket(file, slug);

        if (fileName) {
            setMainImage(fileName);
        } else {
            setError('mainImage', {
                type: 'custom',
                message: 'Could not upload main image.',
            });

            setIsLoading(false);
            return;
        }

        // Upload gallery images
        const galleryFileNames = await addGalleryToBucket(galleryFileList, slug);

        if (galleryFileNames) {
            setGallery(uniq([...gallery, ...galleryFileNames]));
        } else {
            setError('gallery', {
                type: 'custom',
                message: 'Could not upload gallery images.',
            });

            setIsLoading(false);
            return;
        }

        // Add product to the database.
        const hasAddedProduct = await addProduct(
            sku,
            userId,
            title,
            slug,
            content,
            mainImage,
            gallery,
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

        setIsLoading(false);
    };

    const handleRichContent = (content: string) => {
        setValue('content', content);
    };

    useEffect(() => {
        register('content');
    }, []);

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
                        isRequired
                    />
                    <InputField
                        placeholder="Slug"
                        fieldName="slug"
                        instruction="Slug is required."
                        error={slugErr}
                        register={register}
                        Icon={ImFontSize}
                        isRequired
                    />
                    <InputField
                        placeholder="SKU"
                        fieldName="sku"
                        instruction="SKU is required."
                        error={skuErr}
                        register={register}
                        Icon={AiOutlineBarcode}
                        isRequired
                    />
                    <SelectField
                        placeholder="Product type"
                        fieldName="productType"
                        instruction="Product type is required."
                        options={productTypes}
                        error={typeErr}
                        register={register}
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
                        isRequired={false}
                    />
                </div>
                <div className="flex flex-row space-x-4">
                    <ImageUpload
                        fieldName="mainImage"
                        title="Main image"
                        label="Select main image"
                        isRequired
                        isMultiple={false}
                        error={mainImageErr}
                        register={register}
                    />
                    <ImageUpload
                        fieldName="gallery"
                        title="Gallery images"
                        label="Select gallery images"
                        isRequired={false}
                        isMultiple
                        error={galleryErr}
                        register={register}
                    />
                </div>
                <div className="flex flex-col">
                    <RichTextEditor placeholder="Content" onChange={handleRichContent} />
                </div>

                <div className="form-control">
                    <button
                        type="submit"
                        className={`btn btn-block btn-primary rounded-md${isLoading ? ' loading' : ''}`}
                    >
                        {!isLoading && (
                            <React.Fragment>
                                <BsFillCartCheckFill className="inline-block text-xl mr-2" />
                                Add product
                            </React.Fragment>
                        )}
                    </button>
                </div>
            </div>
        </form>
    );
};

export default AddProduct;
