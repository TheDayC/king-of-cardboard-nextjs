import { DateTime } from 'luxon';
import Link from 'next/link';
import React from 'react';
import { BiEdit, BiTrash } from 'react-icons/bi';
import { useDispatch } from 'react-redux';
import { addError, addSuccess } from '../../../store/slices/alerts';

import { Product as ProductType } from '../../../types/productsNew';
import { convertCost, deleteProduct } from '../../../utils/account/products';

interface ProductProps {
    product: ProductType;
}

export const Product: React.FC<ProductProps> = ({ product }) => {
    const dispatch = useDispatch();
    const { _id: id, title, sku, cost, quantity, lastUpdated } = product;
    const prettyCost = convertCost(cost);
    const lastUpdatedDate = DateTime.fromISO(lastUpdated, { zone: 'Europe/London' });

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

    return (
        <div className="card card-side bg-base-100 shadow-xl">
            <figure>
                <img src="https://placeimg.com/200/280/arch" alt="Movie" />
            </figure>
            <div className="card-body justify-between">
                <div className="flex flex-row justify-between">
                    <div className="flex flex-col space-y-2">
                        <h2 className="text-2xl">{title}</h2>
                        <p className="text-sm text-gray-400">SKU: {sku}</p>
                        {quantity && <p className="text-sm text-gray-400">QTY: {quantity}</p>}
                        <p className="text-sm text-gray-400">
                            Last updated: {lastUpdatedDate.toFormat('hh:ss')} - {lastUpdatedDate.toFormat('dd/MM/yyyy')}
                        </p>
                    </div>
                    <div className="flex flex-col">
                        <p className="text-5xl">{prettyCost}</p>
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
