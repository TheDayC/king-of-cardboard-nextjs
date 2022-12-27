import React, { useEffect, useState } from 'react';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import { BsBoxSeam, BsCurrencyPound, BsPlusCircle, BsTruck } from 'react-icons/bs';
import { MdOutlineTitle } from 'react-icons/md';
import { ImFontSize } from 'react-icons/im';
import { toNumber } from 'lodash';
import { BiMinusCircle, BiSave } from 'react-icons/bi';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { useDispatch } from 'react-redux';

import InputField from '../Fields/Input';
import { parseAsString, safelyParse } from '../../../utils/parsers';
import RichTextEditor from '../../RichTextEditor';
import { editProduct } from '../../../utils/account/products';
import { addError, addSuccess } from '../../../store/slices/alerts';
import { addShippingMethod, editShippingMethod } from '../../../utils/account/shipping';
import SelectField from '../Fields/Select';
import { Supplier } from '../../../enums/shipping';

const suppliers = [
    { key: 'Royal Mail', value: Supplier.RoyalMail },
    { key: 'DPD', value: Supplier.DPD },
    { key: 'DHL Express', value: Supplier.DHLExpress },
    { key: 'Evri', value: Supplier.Evri },
];

interface ShippingBodyProps {
    _id?: string;
    created?: string;
    lastUpdated?: string;
    title?: string;
    slug?: string;
    content?: string;
    price?: number;
    min?: number;
    max?: number;
    supplier?: number;
    isNew: boolean;
}

export const ShippingBody: React.FC<ShippingBodyProps> = ({
    _id,
    title,
    slug,
    content: existingContent,
    price,
    min,
    max,
    supplier,
    isNew,
}) => {
    const { data: session } = useSession();
    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        reset,
        getValues,
    } = useForm();
    const router = useRouter();
    const { content } = getValues();
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(false);

    // Errors
    const hasErrors = Object.keys(errors).length > 0;
    const titleErr = safelyParse(errors, 'title.message', parseAsString, null);
    const slugErr = safelyParse(errors, 'slug.message', parseAsString, null);
    const priceErr = safelyParse(errors, 'price.message', parseAsString, null);
    const minErr = safelyParse(errors, 'min.message', parseAsString, null);
    const maxErr = safelyParse(errors, 'max.message', parseAsString, null);
    const supplierErr = safelyParse(errors, 'supplier.message', parseAsString, null);

    // Variables
    const userId = session ? session.user.id : null;

    const onSubmit: SubmitHandler<FieldValues> = async (data: FieldValues) => {
        if (hasErrors || isLoading) {
            return;
        }

        setIsLoading(true);

        const { sku, slug, title, content, price } = data;

        const productData = {
            sku,
            userId,
            title,
            slug,
            content,
            price: toNumber(price),
        };

        if (isNew) {
            const hasAddedProduct = await addShippingMethod(productData);

            if (hasAddedProduct) {
                dispatch(addSuccess('Shipping method added!'));
            } else {
                dispatch(addError('Shipping method already exists.'));
            }

            reset();
            handleRichContent(undefined);
            router.push('/account/shipping');
        } else {
            if (!_id) return;

            const hasEditedProduct = await editShippingMethod(_id || '', productData);

            if (hasEditedProduct) {
                dispatch(addSuccess('Shipping method saved!'));
            } else {
                dispatch(addError('Shipping method could not be saved.'));
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
        if (existingContent) {
            setValue('content', existingContent);
        }
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
                    <SelectField
                        placeholder="Supplier"
                        fieldName="supplier"
                        instruction="Supplier is required."
                        options={suppliers}
                        error={supplierErr}
                        register={register}
                        defaultValue={supplier || Supplier.RoyalMail}
                        Icon={BsBoxSeam}
                    />
                </div>
                <div className="flex flex-row space-x-4 items-start justify-start">
                    <InputField
                        placeholder="Price"
                        fieldName="price"
                        fieldType="number"
                        instruction="Price is required."
                        error={priceErr}
                        register={register}
                        Icon={BsCurrencyPound}
                        defaultValue={price}
                        isRequired
                    />
                    <InputField
                        placeholder="Min days"
                        fieldName="min"
                        fieldType="number"
                        instruction="Min days is required."
                        error={minErr}
                        register={register}
                        Icon={BiMinusCircle}
                        defaultValue={min}
                        isRequired
                    />
                    <InputField
                        placeholder="Max days"
                        fieldName="max"
                        fieldType="number"
                        instruction="Max days is required."
                        error={maxErr}
                        register={register}
                        Icon={BsPlusCircle}
                        defaultValue={max}
                        isRequired
                    />
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
                                        <BsTruck className="inline-block text-xl mr-2" />
                                        Add shipping method
                                    </React.Fragment>
                                ) : (
                                    <React.Fragment>
                                        <BiSave className="inline-block text-xl mr-2" />
                                        Save shipping method
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

export default ShippingBody;
