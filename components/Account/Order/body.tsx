import React, { useState, useEffect } from 'react';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import { BsBoxSeam, BsCartFill, BsFillPinMapFill, BsInputCursorText, BsPhone } from 'react-icons/bs';
import { MdOutlineEmail, MdOutlineTitle } from 'react-icons/md';
import { BiBarcodeReader, BiBuildings, BiCategory, BiSave } from 'react-icons/bi';
import { useRouter } from 'next/router';
import { toNumber } from 'lodash';
import { useDispatch } from 'react-redux';

import InputField from '../Fields/Input';
import { parseAsString, safelyParse } from '../../../utils/parsers';
import { Address } from '../../../types/checkout';
import SelectField from '../Fields/Select';
import { Status, Payment, Fulfillment } from '../../../enums/orders';
import { CartItem } from '../../../types/cart';
import RepeaterField from '../Fields/Repeater';
import { addOrder, editOrder } from '../../../utils/account/order';
import { AccountShippingMethod } from '../../../types/shipping';
import { addSuccess } from '../../../store/slices/alerts';

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

interface OrderBodyProps {
    _id?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    billingAddress?: Address;
    shippingAddress?: Address;
    orderStatus?: Status;
    paymentStatus?: Payment;
    fulfillmentStatus?: Fulfillment;
    shippingMethodId?: string;
    items?: CartItem[];
    isNew: boolean;
    shippingMethods: AccountShippingMethod[];
    trackingNumber: string | null;
}

export const OrderBody: React.FC<OrderBodyProps> = ({
    _id,
    firstName,
    lastName,
    email,
    phone,
    billingAddress,
    shippingAddress,
    orderStatus,
    paymentStatus,
    fulfillmentStatus,
    shippingMethodId,
    items,
    isNew,
    shippingMethods,
    trackingNumber = null,
}) => {
    const dispatch = useDispatch();
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        defaultValues: {
            firstName,
            lastName,
            email,
            phone,
            billingLineOne: billingAddress ? billingAddress.lineOne : '',
            billingLineTwo: billingAddress ? billingAddress.lineTwo : '',
            billingCity: billingAddress ? billingAddress.city : '',
            billingPostcode: billingAddress ? billingAddress.postcode : '',
            billingCounty: billingAddress ? billingAddress.county : '',
            shippingLineOne: shippingAddress ? shippingAddress.lineOne : '',
            shippingLineTwo: shippingAddress ? shippingAddress.lineTwo : '',
            shippingCity: shippingAddress ? shippingAddress.city : '',
            shippingPostcode: shippingAddress ? shippingAddress.postcode : '',
            shippingCounty: shippingAddress ? shippingAddress.county : '',
            orderStatus,
            paymentStatus,
            fulfillmentStatus,
            shippingMethodId,
            sku: items && items.length ? items.map((item) => item.sku) : [],
            quantity: items && items.length ? items.map((item) => item.quantity) : [],
            trackingNumber,
        },
    });
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [repeaterItems, setRepeaterItems] = useState<Record<string, string | number>[]>([defaultRepeateritem]);

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
    const shippingMethodErr = safelyParse(errors, 'shippingMethod.message', parseAsString, null);
    const trackingNumberErr = safelyParse(errors, 'trackingNumber.message', parseAsString, null);

    const reducedShippingMethods = shippingMethods.map((method) => ({
        key: method.title,
        value: method._id,
    }));

    const onSubmit: SubmitHandler<FieldValues> = async (data: FieldValues) => {
        if (hasErrors || isLoading) {
            return;
        }

        setIsLoading(true);

        const payload = {
            userId: null,
            email: data.email,
            orderStatus: toNumber(data.orderStatus),
            paymentStatus: toNumber(data.paymentStatus),
            fulfillmentStatus: toNumber(data.fulfillmentStatus),
            repeaterItems: data.sku.map((sku: string, i: number) => ({ sku, quantity: data.quantity[i] })),
            customerDetails: {
                firstName: data.firstName,
                lastName: data.lastName,
                email: data.email,
                phone: data.phone,
            },
            shippingAddress: {
                lineOne: data.shippingLineOne,
                lineTwo: data.shippingLineTwo,
                company: '',
                city: data.shippingCity,
                postcode: data.shippingPostcode,
                county: data.shippingCounty,
                country: 'GB',
            },
            billingAddress: {
                lineOne: data.billingLineOne,
                lineTwo: data.billingLineTwo,
                company: '',
                city: data.billingCity,
                postcode: data.billingPostcode,
                county: data.billingCounty,
                country: 'GB',
            },
            shouldFindItems: true,
            shouldCalculateTotals: true,
            shippingMethodId: data.shippingMethodId,
        };

        if (isNew) {
            await addOrder(payload);
            dispatch(addSuccess('Order created!'));

            setIsLoading(false);
            router.push('/account/orders');
        } else if (_id) {
            await editOrder(_id, payload);
            dispatch(addSuccess('Order saved!'));

            setIsLoading(false);
        }
    };

    const addRepeaterRow = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();

        setRepeaterItems([...repeaterItems, defaultRepeateritem]);
    };

    const removeRepeaterRow = (rowCount: number) => {
        setRepeaterItems([...repeaterItems.filter((item, i) => i !== rowCount)]);
    };

    useEffect(() => {
        if (items) {
            const mappedRepeaterItems = items.map(({ sku, quantity }) => ({ sku, quantity }));
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
                            isRequired
                        />
                        <InputField
                            placeholder="Last name"
                            fieldName="lastName"
                            instruction="Last name is required."
                            error={lastNameErr}
                            register={register}
                            Icon={MdOutlineTitle}
                            isRequired
                        />
                        <InputField
                            placeholder="Email"
                            fieldName="email"
                            instruction="Email is required."
                            error={emailErr}
                            register={register}
                            Icon={MdOutlineEmail}
                            isRequired
                        />
                        <InputField
                            placeholder="Phone"
                            fieldName="phone"
                            instruction="Phone is required."
                            error={phoneErr}
                            register={register}
                            Icon={BsPhone}
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
                            isRequired
                        />
                        <InputField
                            placeholder="Line Two"
                            fieldName="billingLineTwo"
                            instruction="Line two is required."
                            error={billingErrs.lineTwo}
                            register={register}
                            Icon={MdOutlineTitle}
                            isRequired={false}
                        />
                        <InputField
                            placeholder="City"
                            fieldName="billingCity"
                            instruction="City is required."
                            error={billingErrs.city}
                            register={register}
                            Icon={BiBuildings}
                            isRequired
                        />
                        <InputField
                            placeholder="Postcode"
                            fieldName="billingPostcode"
                            instruction="Postcode is required."
                            error={billingErrs.postcode}
                            register={register}
                            Icon={BsInputCursorText}
                            isRequired
                        />
                        <InputField
                            placeholder="County"
                            fieldName="billingCounty"
                            instruction="County is required."
                            error={billingErrs.county}
                            register={register}
                            Icon={BsFillPinMapFill}
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
                            isRequired
                        />
                        <InputField
                            placeholder="Line Two"
                            fieldName="shippingLineTwo"
                            instruction="Line two is required."
                            error={shippingErrs.lineTwo}
                            register={register}
                            Icon={MdOutlineTitle}
                            isRequired={false}
                        />
                        <InputField
                            placeholder="City"
                            fieldName="shippingCity"
                            instruction="City is required."
                            error={shippingErrs.city}
                            register={register}
                            Icon={BiBuildings}
                            isRequired
                        />
                        <InputField
                            placeholder="Postcode"
                            fieldName="shippingPostcode"
                            instruction="Postcode is required."
                            error={shippingErrs.postcode}
                            register={register}
                            Icon={BsInputCursorText}
                            isRequired
                        />
                        <InputField
                            placeholder="County"
                            fieldName="shippingCounty"
                            instruction="County is required."
                            error={shippingErrs.county}
                            register={register}
                            Icon={BsFillPinMapFill}
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
                            Icon={BiCategory}
                        />
                        <SelectField
                            placeholder="Payment Status"
                            fieldName="paymentStatus"
                            instruction="Payment status is required."
                            options={paymentStatuses}
                            error={statusErrs.payment}
                            register={register}
                            Icon={BiCategory}
                        />
                        <SelectField
                            placeholder="Fulfillment Status"
                            fieldName="fulfillmentStatus"
                            instruction="Fulfillment status is required."
                            options={fulfillmentStatuses}
                            error={statusErrs.fulfillment}
                            register={register}
                            Icon={BiCategory}
                        />
                        <SelectField
                            placeholder="Shipping method"
                            fieldName="shippingMethodId"
                            instruction="Fulfillment status is required."
                            options={reducedShippingMethods}
                            error={shippingMethodErr}
                            register={register}
                            Icon={BiCategory}
                        />
                        <InputField
                            placeholder="Tracking number"
                            fieldName="trackingNumber"
                            instruction=""
                            error={trackingNumberErr}
                            register={register}
                            Icon={BiBarcodeReader}
                            isRequired={false}
                        />
                    </div>
                </div>

                <div className="flex flex-col space-y-4">
                    <h3 className="text-2xl">Items</h3>
                    <div className="flex flex-col space-y-4 items-start justify-start">
                        {repeaterItems.map((item, i) => (
                            <RepeaterField
                                fieldOne="sku"
                                fieldOneLabel="SKU"
                                fieldOneIcon={<BsBoxSeam className="w-5 h-5" />}
                                fieldTwo="quantity"
                                fieldTwoLabel="Quantity"
                                fieldTwoIcon={<BsCartFill className="w-5 h-5" />}
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
