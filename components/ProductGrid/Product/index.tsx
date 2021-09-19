import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';

import selector from './selector';
import ProductButtons from './ProductButtons';
import { filterProducts } from '../../utils/products';

interface ProductProps {
    id: string;
    shortButtons: number;
}

export const Product: React.FC<ProductGridProps> = ({ id, shortButtons }) => {
    const { products } = useSelector(selector);
    const currentProduct = products.find((p) => p.id === id);

    if (currentProduct) {
        return (
            <div className="card bordered" key={product.name}>
                <figure>
                    <img src="https://picsum.photos/id/1005/400/250" />
                </figure>
                <div className="card-body">
                    <h2 className="card-title">
                        {product.name}
                        <div className="badge mx-2 badge-secondary">NEW</div>
                    </h2>
                    <div className="grid grid-cols-2 gap-2 justify-items-stretch card-actions">
                        <ProductButtons id={product.id} stock={product.stock || 0} shortButtons={useFilters} />
                    </div>
                </div>
            </div>
        );
    }

    return null;
};

export default Product;
