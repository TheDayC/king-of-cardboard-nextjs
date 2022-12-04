import React from 'react';
import { GetServerSideProps } from 'next';
import { unstable_getServerSession } from 'next-auth';
import Link from 'next/link';

import AccountWrapper from '../../../components/AccountWrapper';
import { authOptions } from '../../api/auth/[...nextauth]';
import { listProducts } from '../../../utils/account/products';
import { parseAsRole, safelyParse } from '../../../utils/parsers';
import { Roles } from '../../../enums/auth';
import { Product as ProductType } from '../../../types/productsNew';
import Product from '../../../components/Account/Product';
import { MdAddCircleOutline } from 'react-icons/md';

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
            products,
            count,
        },
    };
};

interface ProductsPageProps {
    products: ProductType[];
    count: number;
}

export const ProductsPage: React.FC<ProductsPageProps> = ({ products, count }) => {
    return (
        <AccountWrapper title="Products - Account - King of Cardboard" description="Account page">
            <div className="flex flex-col w-full justify-start items-start p-2 md:p-4 md:p-8 md:flex-row">
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
                        products.map((product) => <Product product={product} key={`product-${product._id}`} />)}
                </div>
            </div>
        </AccountWrapper>
    );
};

export default ProductsPage;
