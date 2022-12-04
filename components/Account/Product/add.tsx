import React from 'react';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import InputField from './Input';
import { parseAsString, safelyParse } from '../../../utils/parsers';
import { BsFillCartCheckFill, BsBoxSeam } from 'react-icons/bs';
import { MdOutlineTitle } from 'react-icons/md';
import { ImFontSize } from 'react-icons/im';
import { AiOutlineBarcode } from 'react-icons/ai';
import RichTextEditor from '../../RichTextEditor';
import SelectField from './Select';
import { ProductType } from '../../../enums/products';

const productTypes = [
    { key: 'Sealed', value: ProductType.Sealed },
    { key: 'Singles', value: ProductType.Singles },
    { key: 'Packs', value: ProductType.Packs },
    { key: 'Other', value: ProductType.Other },
];

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
    const typeErr = safelyParse(errors, 'productType.message', parseAsString, null);

    const onSubmit: SubmitHandler<FieldValues> = async (data: FieldValues) => {
        if (hasErrors) {
            return;
        }
    };

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
                    />
                    <InputField
                        placeholder="Slug"
                        fieldName="slug"
                        instruction="Slug is required."
                        error={slugErr}
                        register={register}
                        Icon={ImFontSize}
                    />
                    <InputField
                        placeholder="SKU"
                        fieldName="sku"
                        instruction="SKU is required."
                        error={skuErr}
                        register={register}
                        Icon={AiOutlineBarcode}
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
