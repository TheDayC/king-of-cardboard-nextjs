import React, { useEffect, useState } from 'react';
import { GetServerSideProps } from 'next';
import { unstable_getServerSession } from 'next-auth';
import Link from 'next/link';
import { MdAddCircleOutline } from 'react-icons/md';

import AccountWrapper from '../../../components/AccountWrapper';
import { authOptions } from '../../api/auth/[...nextauth]';
import { listProducts } from '../../../utils/account/products';
import { parseAsRole, safelyParse } from '../../../utils/parsers';
import { Roles } from '../../../enums/auth';
import { Product as ProductType } from '../../../types/productsNew';
import Product from '../../../components/Account/Product';
import Loading from '../../../components/Loading';

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
    const session = await unstable_getServerSession(req, res, authOptions);
    const role = safelyParse(session, 'user.role', parseAsRole, Roles.User);
    const isAdmin = role === Roles.Admin;
    const { products, count } = await listProducts(10, 1);

    if (!session || !isAdmin) {
        return {
            redirect: {
                permanent: false,
                destination: '/login',
            },
        };
    }

    return {
        props: {
            initialProducts: products,
            totalProducts: count,
        },
    };
};

interface ProductsPageProps {
    initialProducts: ProductType[];
    initialTotalProducts: number;
}

export const ProductsPage: React.FC<ProductsPageProps> = ({ initialProducts, initialTotalProducts }) => {
    const [products, setProducts] = useState<ProductType[]>(initialProducts);
    const [count, setCount] = useState(10);
    const [page, setPage] = useState(1);
    const [totalProducts, setTotalProducts] = useState(initialTotalProducts);
    const [isLoading, setIsLoading] = useState(false);

    const handleUpdateProducts = async () => {
        setIsLoading(true);
        const { products: newProducts, count: newTotalProducts } = await listProducts(count, page);

        setProducts(newProducts);
        setTotalProducts(newTotalProducts);

        setIsLoading(false);
    };

    return (
        <AccountWrapper title="Products - Account - King of Cardboard" description="Account page">
            <div className="flex flex-col w-full justify-start items-start p-2 md:p-4 md:p-8 md:flex-row relative">
                {isLoading && <Loading show />}
                <div className="flex flex-col relative w-full space-y-4" data-testid="content">
                    <div className="flex flex-row justify-between items-center mb-4 pb-4 border-b border-solid border-gray-300">
                        <h1 className="text-3xl">Products</h1>
                        <Link href="/account/products/add" passHref>
                            <button className="btn btn-secondary rounded-md shadow-md">
                                <MdAddCircleOutline className="inline-block text-xl mr-2" />
                                Add product
                            </button>
                        </Link>
                    </div>
                    {products.length > 0 &&
                        products.map((product) => (
                            <Product
                                product={product}
                                key={`product-${product._id}`}
                                updateProducts={handleUpdateProducts}
                            />
                        ))}
                </div>
            </div>
        </AccountWrapper>
    );
};

export default ProductsPage;
