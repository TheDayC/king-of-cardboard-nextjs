import Image from 'next/image';
import React from 'react';
import { FieldValues, UseFormRegister } from 'react-hook-form';
import { BsTruck } from 'react-icons/bs';

import { Supplier } from '../../../../enums/shipping';
import { getPrettyPrice } from '../../../../utils/account/products';
import royalMailLogo from '../../../../images/royal-mail-logo.svg';

interface ShippingMethodProps {
    _id: string;
    title: string;
    content?: string;
    price: number;
    min: number;
    max: number;
    supplier?: Supplier;
    register: UseFormRegister<FieldValues>;
    isDefault: boolean;
}

export const ShippingMethod: React.FC<ShippingMethodProps> = ({
    _id,
    title,
    content,
    price,
    min,
    max,
    //supplier = Supplier.RoyalMail,
    register,
    isDefault,
}) => {
    const formattedPrice = getPrettyPrice(price);

    return (
        <div className="form-control">
            <label className="label cursor-pointer">
                <span className="label-text">
                    <div className="flex flex-col space-y-3">
                        <div className="flex flex-row items-center justify-between">
                            <div className="flex flex-row space-x-4 items-center">
                                {<Image src={royalMailLogo} width={50} height={50} alt="Royal Mail Logo" />}
                                <h4 className="text-md md:text-lg">{title}</h4>
                            </div>
                            <p className="font-bold text-md md:text-lg">{formattedPrice}</p>
                        </div>

                        <p className="text-xs md:text-sm text-gray-400 mt-1">
                            <BsTruck className="w-5 h-5 mr-2 inline -mt-1" />
                            Arrives in {min} - {max} days.
                        </p>
                        {content && <div dangerouslySetInnerHTML={{ __html: content }} />}
                    </div>
                </span>
                <input
                    type="radio"
                    className="radio radio-md"
                    value={_id}
                    defaultChecked={isDefault}
                    {...register('method', {
                        required: { value: true, message: 'Required' },
                    })}
                />
            </label>
        </div>
    );
};

export default ShippingMethod;
