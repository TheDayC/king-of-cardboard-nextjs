import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSession } from 'next-auth/react';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import { useRouter } from 'next/router';
import ProductField from './Field';
import { parseAsString, safelyParse } from '../../../utils/parsers';
import { BsFillCartCheckFill } from 'react-icons/bs';
import { MdOutlineTitle, MdOutlineHttp } from 'react-icons/md';
import { ImFontSize } from 'react-icons/im';
import { AiOutlineBarcode } from 'react-icons/ai';
import RichTextEditor from '../../RichTextEditor';

export const AddProduct: React.FC = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        setValue,
    } = useForm();
    const hasErrors = Object.keys(errors).length > 0;
    const titleErr = safelyParse(errors, 'title.message', parseAsString, null);
    const slugErr = safelyParse(errors, 'slug.message', parseAsString, null);
    const skuErr = safelyParse(errors, 'sku.message', parseAsString, null);

    const onSubmit: SubmitHandler<FieldValues> = async (data: FieldValues) => {
        if (hasErrors) {
            return;
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col space-y-4">
                <div className="flex flex-row space-x-4 items-start justify-start">
                    <ProductField
                        placeholder="Title"
                        fieldName="title"
                        instruction="Title is required."
                        error={titleErr}
                        register={register}
                        Icon={MdOutlineTitle}
                    />
                    <ProductField
                        placeholder="Slug"
                        fieldName="slug"
                        instruction="Slug is required."
                        error={slugErr}
                        register={register}
                        Icon={ImFontSize}
                    />
                    <ProductField
                        placeholder="SKU"
                        fieldName="sku"
                        instruction="SKU is required."
                        error={skuErr}
                        register={register}
                        Icon={AiOutlineBarcode}
                    />
                </div>
                <div className="flex flex-col">
                    <RichTextEditor placeholder="Content" />
                </div>

                <div className="form-control">
                    <button type="submit" className="btn btn-block btn-primary rounded-md">
                        <BsFillCartCheckFill className="inline-block text-xl mr-2" />
                        Add product
                    </button>
                </div>
            </div>
        </form>
    );
};

export default AddProduct;
