import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';

import selector from './selector';
import ProductButtons from './ProductButtons';
import { filterProducts } from '../../utils/products';

interface ProductGridProps {
    useFilters: boolean;
}

export const ProductGrid: React.FC<ProductGridProps> = ({ useFilters }) => {
    const { products, filters } = useSelector(selector);
    const filteredProducts = useMemo(
        () => (useFilters ? filterProducts(products, filters) : products),
        [products, filters, useFilters]
    );

    return (
        <div className="container mx-auto px-16">
            <div className="grid grid-cols-3 gap-4">
                {filteredProducts.map((product) => (
                    <div className="card bordered">
                        <figure>
                            <img src="https://picsum.photos/id/1005/400/250" />
                        </figure>
                        <div className="card-body">
                            <h2 className="card-title">
                                {product.name}
                                <div className="badge mx-2 badge-secondary">NEW</div>
                            </h2>
                            <p>{product.description}</p>
                            <div className="grid grid-cols-2 gap-2 justify-items-stretch card-actions">
                                <ProductButtons id={product.id} stock={product.stock} shortButtons={useFilters} />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProductGrid;
