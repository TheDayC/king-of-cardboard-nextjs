import { DateTime } from 'luxon';
import Link from 'next/link';
import React, { useState } from 'react';
import { BiEdit, BiEditAlt, BiTrash } from 'react-icons/bi';
import { useDispatch } from 'react-redux';
import { toNumber } from 'lodash';
import { AiOutlineCheck, AiOutlineClose } from 'react-icons/ai';
import { BsCalendarEvent, BsTruck } from 'react-icons/bs';

import { addError, addSuccess } from '../../../store/slices/alerts';
import { getPrettyPrice } from '../../../utils/account/products';
import { parseAsString, safelyParse } from '../../../utils/parsers';
import Loading from '../../Loading';
import { AccountShippingMethod } from '../../../types/shipping';
import { deleteShippingMethod, editShippingMethod } from '../../../utils/account/shipping';

interface ShippingProps {
    shippingMethod: AccountShippingMethod;
    updateShippingMethods: () => void;
}

export const Shipping: React.FC<ShippingProps> = ({ shippingMethod, updateShippingMethods }) => {
    const dispatch = useDispatch();
    const { _id: id, title, price, min, max, lastUpdated, content } = shippingMethod;
    const [shouldEditPrice, setShouldEditPrice] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [newPrice, setNewPrice] = useState(price);
    const prettyPrice = getPrettyPrice(price);
    const lastUpdatedDate = DateTime.fromISO(lastUpdated, { zone: 'Europe/London' });

    const handleDelete = async () => {
        if (id) {
            if (confirm('Are you sure?')) {
                const wasDeleted = await deleteShippingMethod(id);

                if (wasDeleted) {
                    dispatch(addSuccess('Shipping method deleted!'));
                } else {
                    dispatch(addError('Shipping method could not be deleted.'));
                }
            }
        }
    };

    const handleEditPrice = () => {
        setShouldEditPrice(true);
    };

    const handleCancelEditPrice = () => {
        setShouldEditPrice(false);
    };

    const handleNewPrice = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = safelyParse(e, 'target.value', parseAsString, `${price}`);

        setNewPrice(toNumber(value));
    };

    const handleSubmitPrice = async () => {
        setIsLoading(true);

        const hasEditedProduct = await editShippingMethod(id, { price: newPrice });

        if (hasEditedProduct) {
            dispatch(addSuccess('Price updated!'));
        } else {
            dispatch(addError('Price could not be updated.'));
        }

        setShouldEditPrice(false);
        setIsLoading(false);
        updateShippingMethods();
    };

    return (
        <div className="card card-side bg-base-100 shadow-xl">
            <div className="card-body justify-between">
                <div className="flex flex-row justify-between">
                    <div className="flex flex-col space-y-2">
                        <h2 className="text-2xl">{title}</h2>
                        <p className="text-xs text-gray-400">
                            <BsCalendarEvent className="inline mr-2 -mt-1" />
                            {lastUpdatedDate.toFormat('hh:ss')} - {lastUpdatedDate.toFormat('dd/MM/yyyy')}
                        </p>
                        <p className="text-md">
                            <BsTruck className="inline w-5 h-5 mr-2 -mt-1" />
                            {min} - {max} days.
                        </p>
                        <div dangerouslySetInnerHTML={{ __html: content }} />
                    </div>
                    <div className="flex flex-col justify-start">
                        <div className="flex flex-row space-x-4 items-end">
                            {shouldEditPrice ? (
                                <div className="flex flex-row space-x-2 items-center relative">
                                    {isLoading && <Loading show width={5} height={5} />}
                                    <div className="form-control">
                                        <input
                                            type="number"
                                            placeholder="Price"
                                            className="input input-sm input-bordered"
                                            defaultValue={price}
                                            onChange={handleNewPrice}
                                            id="newPrice"
                                            autoFocus
                                        />
                                    </div>
                                    <AiOutlineCheck
                                        className="inline-block text-xl text-success cursor-pointer"
                                        onClick={handleSubmitPrice}
                                    />
                                    <AiOutlineClose
                                        className="inline-block text-xl text-error cursor-pointer"
                                        onClick={handleCancelEditPrice}
                                    />
                                </div>
                            ) : (
                                <div className="flex flex-row space-x-4 items-center" onClick={handleEditPrice}>
                                    <p className="text-5xl">{prettyPrice}</p>
                                    <BiEditAlt className="inline-block text-2xl text-gray-400 cursor-pointer mt-1" />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                <div className="card-actions justify-start mt-4">
                    <Link
                        href={{
                            pathname: '/account/shipping/edit/[id]',
                            query: { id },
                        }}
                        passHref
                    >
                        <button className="btn btn-neutral rounded-md shadow-md">
                            <BiEdit className="inline-block text-xl mr-2" />
                            Edit
                        </button>
                    </Link>
                    <button className="btn btn-error rounded-md shadow-md text-white" onClick={handleDelete}>
                        <BiTrash className="inline-block text-xl" />
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Shipping;
