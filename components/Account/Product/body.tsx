import React, { useEffect, useState } from 'react';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import { BsFillCartCheckFill, BsBoxSeam, BsCurrencyPound, BsCalendarDate, BsLaptop } from 'react-icons/bs';
import { MdOutlineTitle } from 'react-icons/md';
import { ImFontSize } from 'react-icons/im';
import { AiOutlinePoundCircle } from 'react-icons/ai';
import { FaBoxes, FaPlaneArrival } from 'react-icons/fa';
import { kebabCase, toLower, toNumber, toUpper } from 'lodash';
import { BiBarcodeReader, BiCategory, BiFootball, BiSave } from 'react-icons/bi';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { useDispatch } from 'react-redux';
import { DateTime } from 'luxon';

import InputField from '../Fields/Input';
import { parseAsString, safelyParse } from '../../../utils/parsers';
import RichTextEditor from '../../RichTextEditor';
import SelectField from '../Fields/Select';
import { Category, Configuration, Interest, StockStatus } from '../../../enums/products';
import { addGalleryToBucket, addImageToBucket, addProduct, editProduct } from '../../../utils/account/products';
import { addError, addSuccess } from '../../../store/slices/alerts';
import ImageUpload from '../Fields/ImageUpload';
import { PriceHistory } from '../../../types/products';

const productCategory = [
    { key: 'Sports', value: Category.Sports },
    { key: 'TCG', value: Category.TCG },
    { key: 'Other', value: Category.Other },
];

const productConfig = [
    { key: 'Sealed', value: Configuration.Sealed },
    { key: 'Singles', value: Configuration.Singles },
    { key: 'Packs', value: Configuration.Packs },
    { key: 'Other', value: Configuration.Other },
];

const productInterest = [
    { key: 'Baseball', value: Interest.Baseball },
    { key: 'Basketball', value: Interest.Basketball },
    { key: 'Football', value: Interest.Football },
    { key: 'Soccer', value: Interest.Soccer },
    { key: 'UFC', value: Interest.UFC },
    { key: 'Wrestling', value: Interest.Wrestling },
    { key: 'TCG', value: Interest.TCG },
    { key: 'Other', value: Interest.Other },
    { key: 'Formula 1', value: Interest.F1 },
];

const productStatus = [
    { key: 'In Stock', value: StockStatus.InStock },
    { key: 'Out of Stock', value: StockStatus.OutOfStock },
    { key: 'Pre-Order', value: StockStatus.PreOrder },
    { key: 'Import', value: StockStatus.Import },
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
    category?: number;
    configuration?: number;
    interest?: number;
    stockStatus?: number;
    quantity?: number | null;
    price?: number;
    salePrice?: number;
    isInfinite?: boolean;
    priceHistory?: PriceHistory[];
    releaseDate?: string | null;
    isNew: boolean;
    metaTitle?: string;
    metaDescription?: string;
}

export const ProductBody: React.FC<ProductBodyProps> = ({
    _id,
    sku,
    title,
    slug,
    content: existingContent,
    mainImage,
    gallery,
    category,
    configuration,
    interest,
    stockStatus,
    quantity,
    price,
    salePrice,
    priceHistory,
    releaseDate = null,
    isNew,
    metaTitle,
    metaDescription,
}) => {
    const { data: session } = useSession();
    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        setError,
        reset,
    } = useForm({
        defaultValues: {
            title,
            category,
            configuration,
            interest,
            stockStatus,
            quantity,
            price,
            salePrice: salePrice && salePrice > 0 ? salePrice : undefined,
            mainImage,
            gallery,
            content: existingContent,
            historicalTimestamp: priceHistory && priceHistory.length ? priceHistory.map((pH) => pH.timestamp) : [],
            historicalPrice: priceHistory && priceHistory.length ? priceHistory.map((pH) => pH.price) : [],
            releaseDate,
            metaTitle,
            metaDescription,
        },
    });
    const router = useRouter();
    const dispatch = useDispatch();
    console.log('🚀 ~ file: body.tsx:130 ~ releaseDate:', releaseDate);

    // State
    const [isLoading, setIsLoading] = useState(false);
    const [mainImageFileList, setMainImageFileList] = useState<FileList | null>(null);
    const [galleryFileList, setGalleryFileList] = useState<FileList | null>(null);
    const [startDate, setStartDate] = useState<Date | null>(
        releaseDate ? DateTime.fromISO(releaseDate).toJSDate() : null
    );
    console.log('🚀 ~ file: body.tsx:141 ~ startDate:', startDate);
    const [titleField, setTitleField] = useState('');
    const [currentContent, setCurrentContent] = useState<string | undefined>(existingContent);

    // Errors
    const hasErrors = Object.keys(errors).length > 0;
    const titleErr = safelyParse(errors, 'title.message', parseAsString, null);
    const releaseDateErr = safelyParse(errors, 'releaseDate.message', parseAsString, null);
    const typeErr = safelyParse(errors, 'productType.message', parseAsString, null);
    const qtyErr = safelyParse(errors, 'quantity.message', parseAsString, null);
    const priceErr = safelyParse(errors, 'price.message', parseAsString, null);
    const salePriceErr = safelyParse(errors, 'salePrice.message', parseAsString, null);
    const mainImageErr = safelyParse(errors, 'mainImage.message', parseAsString, null);
    const galleryErr = safelyParse(errors, 'gallery.message', parseAsString, null);
    const metaTitleErr = safelyParse(errors, 'metaTitle.message', parseAsString, null);
    const metaDescriptionErr = safelyParse(errors, 'metaDescription.message', parseAsString, null);

    // Variables
    const userId = session ? session.user.id : null;

    const onSubmit: SubmitHandler<FieldValues> = async (data: FieldValues) => {
        if (hasErrors || isLoading) {
            return;
        }

        setIsLoading(true);

        const {
            title,
            content,
            category,
            configuration,
            interest,
            quantity,
            stockStatus,
            price,
            salePrice,
            metaTitle,
            metaDescription,
        } = data;
        const sku = toUpper(kebabCase(title));
        const slug = toLower(kebabCase(title));
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

        // eslint-disable-next-line
        console.log('DateTime.fromJSDate(startDate).toISO():', startDate && DateTime.fromJSDate(startDate).toISO());

        const productData = {
            sku,
            userId,
            title,
            slug,
            content,
            mainImage: fileName,
            gallery: galleryFileNames,
            category: toNumber(category),
            configuration: toNumber(configuration),
            interest: toNumber(interest),
            quantity: toNumber(quantity),
            stockStatus: toNumber(stockStatus),
            price: toNumber(price),
            salePrice: toNumber(salePrice),
            priceHistory: data.historicalTimestamp.map((timestamp: string, i: number) => ({
                timestamp,
                price: data.historicalPrice[i],
            })),
            releaseDate: startDate ? DateTime.fromJSDate(startDate).toISO() : null,
            isInfinite: false,
            metaTitle,
            metaDescription,
        };

        if (isNew) {
            const hasAddedProduct = await addProduct(productData);

            if (hasAddedProduct) {
                dispatch(addSuccess('Product added!'));
            } else {
                dispatch(addError('Product already exists.'));
            }

            reset();
            handleRichContent(undefined);
            router.push('/account/products');
        } else {
            const hasEditedProduct = await editProduct(_id || '', productData);

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
        setCurrentContent(content);
    };

    /* const addRepeaterRow = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();

        setRepeaterItems([...repeaterItems, defaultRepeateritem]);
    };

    const removeRepeaterRow = (rowCount: number) => {
        setRepeaterItems([...repeaterItems.filter((item, i) => i !== rowCount)]);
    }; */

    const handleReleaseDate = (date: Date | null) => {
        setValue('releaseDate', date ? DateTime.fromJSDate(date).toFormat('dd/MM/yyyy') : null);
        setStartDate(date);
    };

    const handleTitleValue = (value: string) => {
        setTitleField(value);
    };

    useEffect(() => {
        register('content');
    }, [register]);

    useEffect(() => {
        register('releaseDate');
    }, [register]);

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col space-y-4">
                <div className="flex flex-col space-y-4 lg:flex-row lg:space-x-4 lg:space-y-0 items-start justify-start">
                    <InputField
                        placeholder="Title"
                        fieldName="title"
                        instruction="Title is required."
                        error={titleErr}
                        register={register}
                        Icon={MdOutlineTitle}
                        onChange={handleTitleValue}
                        isRequired
                    />
                    <InputField
                        placeholder="Meta title"
                        fieldName="metaTitle"
                        instruction="Meta title is required."
                        error={metaTitleErr}
                        register={register}
                        Icon={MdOutlineTitle}
                        isRequired
                    />
                    <InputField
                        placeholder="Meta description"
                        fieldName="metaDescription"
                        instruction="Meta description is required."
                        error={metaDescriptionErr}
                        register={register}
                        Icon={ImFontSize}
                        isRequired
                    />
                </div>
                <div className="flex flex-col space-y-4 lg:flex-row lg:space-x-4 lg:space-y-0 items-start justify-start">
                    <p className="text-sm text-gray-400">
                        <BsLaptop className="inline w-5 h-5 mr-1 -mt-1" />
                        <span>Slug: {slug ? slug : toLower(kebabCase(titleField))}</span>
                    </p>
                    <p className="text-sm text-gray-400">
                        <BiBarcodeReader className="inline w-5 h-5 mr-1 -mt-1" />
                        <span>SKU: {sku ? sku : toLower(kebabCase(titleField))}</span>
                    </p>
                </div>
                <div className="flex flex-col space-y-4 lg:flex-row lg:space-x-4 lg:space-y-0 items-start justify-start">
                    <SelectField
                        placeholder="Category"
                        fieldName="category"
                        instruction="Category is required."
                        options={productCategory}
                        error={typeErr}
                        register={register}
                        Icon={BiCategory}
                    />
                    <SelectField
                        placeholder="Configuration"
                        fieldName="configuration"
                        instruction="Configuration is required."
                        options={productConfig}
                        error={typeErr}
                        register={register}
                        Icon={BsBoxSeam}
                    />
                    <SelectField
                        placeholder="Interest"
                        fieldName="interest"
                        instruction="Interest is required."
                        options={productInterest}
                        error={typeErr}
                        register={register}
                        Icon={BiFootball}
                    />
                    <SelectField
                        placeholder="Stock Status"
                        fieldName="stockStatus"
                        instruction="Stock status is required."
                        options={productStatus}
                        error={typeErr}
                        register={register}
                        defaultValue={stockStatus}
                        Icon={FaPlaneArrival}
                    />
                </div>
                <div className="flex flex-col space-y-4 lg:flex-row lg:space-x-4 lg:space-y-0 items-start justify-start">
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
                    <InputField
                        placeholder="Release date"
                        fieldName="releaseDate"
                        instruction=""
                        error={releaseDateErr}
                        register={register}
                        Icon={BsCalendarDate}
                        isRequired={false}
                        isDate
                        startDate={startDate}
                        setStartDate={handleReleaseDate}
                    />
                </div>
                <div className="flex flex-col space-y-4 lg:flex-row lg:space-x-4 lg:space-y-0 w-full">
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
                    <RichTextEditor placeholder="Content" onChange={handleRichContent} value={currentContent || ''} />
                </div>

                {/* <div className="flex flex-col space-y-4">
                    <h3 className="text-2xl">Items</h3>
                    <div className="flex flex-col space-y-4 items-start justify-start">
                        {repeaterItems.map((item, i) => (
                            <RepeaterField
                                fieldOne="historicalTimestamp"
                                fieldOneLabel="Timestamp"
                                fieldOneIcon={<BsCalendarDate className="w-5 h-5" />}
                                fieldTwo="historicalPrice"
                                fieldTwoLabel="Price"
                                fieldTwoIcon={<BsFillTagFill className="w-5 h-5" />}
                                rowCount={i}
                                register={register}
                                isLastRow={i === repeaterItems.length - 1}
                                addRepeaterRow={addRepeaterRow}
                                removeRepeaterRow={removeRepeaterRow}
                                key={`item-${i}`}
                            />
                        ))}
                    </div>
                </div> */}

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
