import { DateTime } from 'luxon';
import Link from 'next/link';
import Image from 'next/image';
import React, { useState } from 'react';
import { BiEdit, BiEditAlt, BiTrash } from 'react-icons/bi';
import { useDispatch } from 'react-redux';
import { toNumber } from 'lodash';
import { AiOutlineCheck, AiOutlineClose } from 'react-icons/ai';

import { addError, addSuccess } from '../../../store/slices/alerts';
import { Product as ProductType } from '../../../types/productsNew';
import { getPrettyPrice, deleteProduct, editProduct } from '../../../utils/account/products';
import { parseAsString, safelyParse } from '../../../utils/parsers';
import Loading from '../../Loading';
import { isNumber } from '../../../utils/typeguards';

interface ProductProps {
    product: ProductType;
    updateProducts: () => void;
}

export const Product: React.FC<ProductProps> = ({ product, updateProducts }) => {
    const dispatch = useDispatch();
    const { _id: id, title, sku, price, salePrice, quantity, lastUpdated, mainImage } = product;
    const [shouldEditPrice, setShouldEditPrice] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [newPrice, setNewPrice] = useState(price);
    const prettyPrice = getPrettyPrice(price);
    const prettySalePrice = getPrettyPrice(salePrice);
    const lastUpdatedDate = DateTime.fromISO(lastUpdated, { zone: 'Europe/London' });
    const isOnSale = salePrice !== 0 && salePrice !== price;

    const handleDelete = async () => {
        if (id) {
            if (confirm('Are you sure?')) {
                const wasDeleted = await deleteProduct(id);

                if (wasDeleted) {
                    dispatch(addSuccess('Product deleted!'));
                } else {
                    dispatch(addError('Product could not be deleted.'));
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

        const hasEditedProduct = isOnSale
            ? await editProduct(id, { salePrice: newPrice })
            : await editProduct(id, { price: newPrice });

        if (hasEditedProduct) {
            dispatch(addSuccess('Price updated!'));
        } else {
            dispatch(addError('Price could not be updated.'));
        }

        setShouldEditPrice(false);
        setIsLoading(false);
        updateProducts();
    };

    return (
        <div className="card card-side bg-base-100 shadow-xl">
            <figure className="w-48 overflow-hidden relative">
                <Image
                    src={`https://kocardboard-images.s3.eu-west-1.amazonaws.com/${mainImage}`}
                    fill
                    sizes="(max-width: 192px) 100vw"
                    alt={`${title} image`}
                    title={`${title} image`}
                />
            </figure>
            <div className="card-body justify-between">
                <div className="flex flex-row justify-between">
                    <div className="flex flex-col space-y-2">
                        <h2 className="text-2xl">{title}</h2>
                        <p className="text-sm text-gray-400">SKU: {sku}</p>
                        {isNumber(quantity) && <p className="text-sm text-gray-400">QTY: {quantity}</p>}
                        <p className="text-sm text-gray-400">
                            Last updated: {lastUpdatedDate.toFormat('hh:ss')} - {lastUpdatedDate.toFormat('dd/MM/yyyy')}
                        </p>
                    </div>
                    <div className="flex flex-col justify-start">
                        <div className="flex flex-row space-x-4 items-end">
                            {isOnSale && <p className="text-lg text-error line-through">{prettyPrice}</p>}
                            {shouldEditPrice ? (
                                <div className="flex flex-row space-x-2 items-center relative">
                                    {isLoading && <Loading show width={5} height={5} />}
                                    <div className="form-control">
                                        <input
                                            type="number"
                                            placeholder="Price"
                                            className="input input-sm input-bordered"
                                            defaultValue={isOnSale ? salePrice : price}
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
                                    <p className="text-5xl">{isOnSale ? prettySalePrice : prettyPrice}</p>
                                    <BiEditAlt className="inline-block text-2xl text-gray-400 cursor-pointer mt-1" />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                <div className="card-actions justify-start">
                    <Link
                        href={{
                            pathname: '/account/products/edit/[id]',
                            query: { id },
                        }}
                        passHref
                    >
                        <button className="btn btn-neutral rounded-md shadow-md">
                            <BiEdit className="inline-block text-xl mr-2" />
                            Edit
                        </button>
                    </Link>
                    <button className="btn btn-error rounded-md shadow-md" onClick={handleDelete}>
                        <BiTrash className="inline-block text-xl" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Product;
