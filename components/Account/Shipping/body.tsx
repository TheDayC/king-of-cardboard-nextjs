import React, { useEffect, useState } from 'react';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import { BsBoxSeam, BsCurrencyPound, BsPlusCircle, BsTruck } from 'react-icons/bs';
import { MdOutlineTitle } from 'react-icons/md';
import { ImFontSize } from 'react-icons/im';
import { toNumber } from 'lodash';
import { BiMinusCircle, BiSave } from 'react-icons/bi';
import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';

import InputField from '../Fields/Input';
import { parseAsString, safelyParse } from '../../../utils/parsers';
import RichTextEditor from '../../RichTextEditor';
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
    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        reset,
    } = useForm({
        defaultValues: {
            title,
            slug,
            supplier: supplier || Supplier.RoyalMail,
            price,
            min,
            max,
            content: existingContent,
        },
    });
    const router = useRouter();
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(false);
    const [currentContent, setCurrentContent] = useState<string | undefined>(existingContent);

    // Errors
    const hasErrors = Object.keys(errors).length > 0;
    const titleErr = safelyParse(errors, 'title.message', parseAsString, null);
    const slugErr = safelyParse(errors, 'slug.message', parseAsString, null);
    const priceErr = safelyParse(errors, 'price.message', parseAsString, null);
    const minErr = safelyParse(errors, 'min.message', parseAsString, null);
    const maxErr = safelyParse(errors, 'max.message', parseAsString, null);
    const supplierErr = safelyParse(errors, 'supplier.message', parseAsString, null);

    const onSubmit: SubmitHandler<FieldValues> = async (data: FieldValues) => {
        if (hasErrors || isLoading) {
            return;
        }

        setIsLoading(true);

        const { title, slug, content, price, min, max, supplier } = data;

        const methodData = {
            title,
            slug,
            content,
            price: toNumber(price),
            min: toNumber(min),
            max: toNumber(max),
            supplier: toNumber(supplier),
        };

        if (isNew) {
            const hasAddedProduct = await addShippingMethod(methodData);

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

            const hasEditedProduct = await editShippingMethod(_id, methodData);

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
        setCurrentContent(content);
    };

    useEffect(() => {
        register('content');
    }, [register]);

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
                    <SelectField
                        placeholder="Supplier"
                        fieldName="supplier"
                        instruction="Supplier is required."
                        options={suppliers}
                        error={supplierErr}
                        register={register}
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
                        isRequired
                    />
                </div>
                <div className="flex flex-col">
                    <RichTextEditor placeholder="Content" onChange={handleRichContent} value={currentContent || ''} />
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
