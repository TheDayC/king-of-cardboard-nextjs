import React, { useState, useEffect } from 'react';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import { BsBoxSeam, BsFillPinMapFill, BsInputCursorText, BsPhone } from 'react-icons/bs';
import { MdOutlineEmail, MdOutlineTitle } from 'react-icons/md';
import { BiBuildings, BiCategory, BiSave } from 'react-icons/bi';
import { useSession } from 'next-auth/react';

import InputField from '../Fields/Input';
import { parseAsString, safelyParse } from '../../../utils/parsers';
import { Address } from '../../../types/checkout';
import SelectField from '../Fields/Select';
import { Status, Payment, Fulfillment } from '../../../enums/orders';
import { RepeaterItem } from '../../../types/orders';
import { CartItem } from '../../../types/cart';
import RepeaterField from '../Fields/Repeater';

const orderStatuses = [
    { key: 'Approved', value: Status.Approved },
    { key: 'Cancelled', value: Status.Cancelled },
    { key: 'Fulfilled', value: Status.Fulfilled },
    { key: 'Pending', value: Status.Pending },
    { key: 'Placed', value: Status.Placed },
];

const paymentStatuses = [
    { key: 'Authorised', value: Payment.Authorised },
    { key: 'Paid', value: Payment.Paid },
    { key: 'Refunded', value: Payment.Refunded },
    { key: 'Unpaid', value: Payment.Unpaid },
];

const fulfillmentStatuses = [
    { key: 'Fulfilled', value: Fulfillment.Fulfilled },
    { key: 'InProgress', value: Fulfillment.InProgress },
    { key: 'Unfulfilled', value: Fulfillment.Unfulfilled },
];

const defaultRepeateritem = { sku: '', quantity: 0 };

interface ProductBodyProps {
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    billingAddress?: Address;
    shippingAddress?: Address;
    orderStatus?: Status;
    paymentStatus?: Payment;
    fulfillmentStatus?: Fulfillment;
    items?: CartItem[];
    isNew: boolean;
}

export const OrderBody: React.FC<ProductBodyProps> = ({
    firstName,
    lastName,
    email,
    phone,
    billingAddress,
    shippingAddress,
    orderStatus,
    paymentStatus,
    fulfillmentStatus,
    items,
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
    } = useForm();
    const [isLoading, setIsLoading] = useState(false);
    const [repeaterItems, setRepeaterItems] = useState<RepeaterItem[]>([defaultRepeateritem]);

    // Errors
    const hasErrors = Object.keys(errors).length > 0;
    const firstNameErr = safelyParse(errors, 'firstName.message', parseAsString, null);
    const lastNameErr = safelyParse(errors, 'lastName.message', parseAsString, null);
    const emailErr = safelyParse(errors, 'email.message', parseAsString, null);
    const phoneErr = safelyParse(errors, 'phone.message', parseAsString, null);
    const billingErrs = {
        lineOne: safelyParse(errors, 'billingLineOne.message', parseAsString, null),
        lineTwo: safelyParse(errors, 'billingLineTwo.message', parseAsString, null),
        city: safelyParse(errors, 'billingCity.message', parseAsString, null),
        postcode: safelyParse(errors, 'billingPostcode.message', parseAsString, null),
        county: safelyParse(errors, 'billingCounty.message', parseAsString, null),
    };
    const shippingErrs = {
        lineOne: safelyParse(errors, 'shippingLineOne.message', parseAsString, null),
        lineTwo: safelyParse(errors, 'shippingLineTwo.message', parseAsString, null),
        city: safelyParse(errors, 'shippingCity.message', parseAsString, null),
        postcode: safelyParse(errors, 'shippingPostcode.message', parseAsString, null),
        county: safelyParse(errors, 'shippingCounty.message', parseAsString, null),
    };
    const statusErrs = {
        order: safelyParse(errors, 'orderStatus.message', parseAsString, null),
        payment: safelyParse(errors, 'paymentStatus.message', parseAsString, null),
        fulfillment: safelyParse(errors, 'fulfillmentStatus.message', parseAsString, null),
    };

    const onSubmit: SubmitHandler<FieldValues> = async (data: FieldValues) => {
        if (hasErrors || isLoading) {
            return;
        }

        setIsLoading(true);

        setIsLoading(false);
    };

    const addRepeaterRow = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();

        setRepeaterItems([...repeaterItems, defaultRepeateritem]);
    };

    const removeRepeaterRow = (rowCount: number) => {
        console.log('🚀 ~ file: body.tsx:122 ~ removeRepeaterRow ~ rowCount', rowCount);
        setRepeaterItems([...repeaterItems.filter((item, i) => i !== rowCount)]);
    };

    useEffect(() => {
        if (items) {
            const mappedRepeaterItems: RepeaterItem[] = items.map(({ sku, quantity }) => ({ sku, quantity }));
            setRepeaterItems(mappedRepeaterItems);
        }
    }, [items]);

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col space-y-4">
                <div className="flex flex-col space-y-4">
                    <h3 className="text-2xl">Customer Details</h3>
                    <div className="flex flex-row space-x-4 items-start justify-start">
                        <InputField
                            placeholder="First name"
                            fieldName="firstName"
                            instruction="First name is required."
                            error={firstNameErr}
                            register={register}
                            Icon={MdOutlineTitle}
                            defaultValue={firstName}
                            isRequired
                        />
                        <InputField
                            placeholder="Last name"
                            fieldName="lastName"
                            instruction="Last name is required."
                            error={lastNameErr}
                            register={register}
                            Icon={MdOutlineTitle}
                            defaultValue={lastName}
                            isRequired
                        />
                        <InputField
                            placeholder="Email"
                            fieldName="email"
                            instruction="Email is required."
                            error={emailErr}
                            register={register}
                            Icon={MdOutlineEmail}
                            defaultValue={email}
                            isRequired
                        />
                        <InputField
                            placeholder="Phone"
                            fieldName="phone"
                            instruction="Phone is required."
                            error={phoneErr}
                            register={register}
                            Icon={BsPhone}
                            defaultValue={phone}
                            isRequired
                        />
                    </div>
                </div>
                <div className="flex flex-col space-y-4">
                    <h3 className="text-2xl">Billing Address</h3>
                    <div className="flex flex-row space-x-4 items-start justify-start">
                        <InputField
                            placeholder="Line One"
                            fieldName="billingLineOne"
                            instruction="Line one is required."
                            error={billingErrs.lineOne}
                            register={register}
                            Icon={MdOutlineTitle}
                            defaultValue={billingAddress ? billingAddress.lineOne : undefined}
                            isRequired
                        />
                        <InputField
                            placeholder="Line Two"
                            fieldName="billingLineTwo"
                            instruction="Line two is required."
                            error={billingErrs.lineTwo}
                            register={register}
                            Icon={MdOutlineTitle}
                            defaultValue={billingAddress ? billingAddress.lineTwo : undefined}
                            isRequired
                        />
                        <InputField
                            placeholder="City"
                            fieldName="billingCity"
                            instruction="City is required."
                            error={billingErrs.city}
                            register={register}
                            Icon={BiBuildings}
                            defaultValue={billingAddress ? billingAddress.city : undefined}
                            isRequired
                        />
                        <InputField
                            placeholder="Postcode"
                            fieldName="billingPostcode"
                            instruction="Postcode is required."
                            error={billingErrs.postcode}
                            register={register}
                            Icon={BsInputCursorText}
                            defaultValue={billingAddress ? billingAddress.postcode : undefined}
                            isRequired
                        />
                        <InputField
                            placeholder="County"
                            fieldName="billingCounty"
                            instruction="County is required."
                            error={billingErrs.county}
                            register={register}
                            Icon={BsFillPinMapFill}
                            defaultValue={billingAddress ? billingAddress.county : undefined}
                            isRequired
                        />
                    </div>
                </div>

                <div className="flex flex-col space-y-4">
                    <h3 className="text-2xl">Shipping Address</h3>
                    <div className="flex flex-row space-x-4 items-start justify-start">
                        <InputField
                            placeholder="Line One"
                            fieldName="shippingLineOne"
                            instruction="Line one is required."
                            error={shippingErrs.lineOne}
                            register={register}
                            Icon={MdOutlineTitle}
                            defaultValue={shippingAddress ? shippingAddress.lineOne : undefined}
                            isRequired
                        />
                        <InputField
                            placeholder="Line Two"
                            fieldName="shippingLineTwo"
                            instruction="Line two is required."
                            error={shippingErrs.lineTwo}
                            register={register}
                            Icon={MdOutlineTitle}
                            defaultValue={shippingAddress ? shippingAddress.lineTwo : undefined}
                            isRequired
                        />
                        <InputField
                            placeholder="City"
                            fieldName="shippingCity"
                            instruction="City is required."
                            error={shippingErrs.city}
                            register={register}
                            Icon={BiBuildings}
                            defaultValue={shippingAddress ? shippingAddress.city : undefined}
                            isRequired
                        />
                        <InputField
                            placeholder="Postcode"
                            fieldName="shippingPostcode"
                            instruction="Postcode is required."
                            error={shippingErrs.postcode}
                            register={register}
                            Icon={BsInputCursorText}
                            defaultValue={shippingAddress ? shippingAddress.postcode : undefined}
                            isRequired
                        />
                        <InputField
                            placeholder="County"
                            fieldName="shippingCounty"
                            instruction="County is required."
                            error={shippingErrs.county}
                            register={register}
                            Icon={BsFillPinMapFill}
                            defaultValue={shippingAddress ? shippingAddress.county : undefined}
                            isRequired
                        />
                    </div>
                </div>
                <div className="flex flex-col space-y-4">
                    <h3 className="text-2xl">Statuses</h3>
                    <div className="flex flex-row space-x-4 items-start justify-start">
                        <SelectField
                            placeholder="Order Status"
                            fieldName="orderStatus"
                            instruction="Order status is required."
                            options={orderStatuses}
                            error={statusErrs.order}
                            register={register}
                            defaultValue={orderStatus}
                            Icon={BiCategory}
                        />
                        <SelectField
                            placeholder="Payment Status"
                            fieldName="paymentStatus"
                            instruction="Payment status is required."
                            options={paymentStatuses}
                            error={statusErrs.payment}
                            register={register}
                            defaultValue={paymentStatus}
                            Icon={BiCategory}
                        />
                        <SelectField
                            placeholder="Fulfillment Status"
                            fieldName="fulfillmentStatus"
                            instruction="Fulfillment status is required."
                            options={fulfillmentStatuses}
                            error={statusErrs.fulfillment}
                            register={register}
                            defaultValue={fulfillmentStatus}
                            Icon={BiCategory}
                        />
                    </div>
                </div>

                <div className="flex flex-col space-y-4">
                    <h3 className="text-2xl">Items</h3>
                    <div className="flex flex-col space-y-4 items-start justify-start">
                        {repeaterItems.map((item, i) => (
                            <RepeaterField
                                {...item}
                                rowCount={i}
                                register={register}
                                isLastRow={i === repeaterItems.length - 1}
                                addRepeaterRow={addRepeaterRow}
                                removeRepeaterRow={removeRepeaterRow}
                                key={`item-${i}`}
                            />
                        ))}
                    </div>
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
                                        <BsBoxSeam className="inline-block text-xl mr-2" />
                                        Add Order
                                    </React.Fragment>
                                ) : (
                                    <React.Fragment>
                                        <BiSave className="inline-block text-xl mr-2" />
                                        Save Order
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

export default OrderBody;
