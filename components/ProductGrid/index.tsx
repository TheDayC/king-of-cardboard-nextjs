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
        <div className="flex-1">
            <div className="grid xs:grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl2:grid-cols-4 gap-4">
                {filteredProducts.map((product) => (
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
                ))}
            </div>
        </div>
    );
};

export default ProductGrid;
