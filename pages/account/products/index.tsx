import React, { useState } from 'react';
import { GetServerSideProps } from 'next';
import { unstable_getServerSession } from 'next-auth';
import Link from 'next/link';
import { MdAddCircleOutline } from 'react-icons/md';

import AccountWrapper from '../../../components/AccountWrapper';
import { authOptions } from '../../api/auth/[...nextauth]';
import { listProducts } from '../../../utils/account/products';
import { parseAsRole, safelyParse } from '../../../utils/parsers';
import { Roles } from '../../../enums/auth';
import { Product as ProductType } from '../../../types/products';
import Product from '../../../components/Account/Product';
import Loading from '../../../components/Loading';
import Pagination from '../../../components/Pagination';
import SearchBar from '../../../components/Account/Fields/SearchBar';

const LIMIT = 8;
const PAGE = 0;

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
    const session = await unstable_getServerSession(req, res, authOptions);
    const role = safelyParse(session, 'user.role', parseAsRole, Roles.User);
    const isAdmin = role === Roles.Admin;
    const { products, count } = await listProducts(LIMIT, PAGE, true);

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
            initialProducts: products || [],
            initialTotalProducts: count || 0,
        },
    };
};

interface ProductsPageProps {
    initialProducts: ProductType[];
    initialTotalProducts: number;
}

export const ProductsPage: React.FC<ProductsPageProps> = ({ initialProducts, initialTotalProducts }) => {
    const [products, setProducts] = useState<ProductType[]>(initialProducts);
    const [page, setPage] = useState(PAGE);
    const [totalProducts, setTotalProducts] = useState(initialTotalProducts);
    const [isLoading, setIsLoading] = useState(false);
    const [currentTerm, setCurrentTerm] = useState('');
    const pageCount = totalProducts / LIMIT;

    const handleUpdateProducts = async (nextPage: number) => {
        setIsLoading(true);
        const { products: newProducts, count: newTotalProducts } = await listProducts(
            LIMIT,
            LIMIT * nextPage,
            false,
            undefined,
            undefined,
            undefined,
            undefined,
            currentTerm
        );

        setProducts(newProducts);
        setTotalProducts(newTotalProducts);

        setIsLoading(false);
    };

    const handlePageNumber = (nextPage: number) => {
        setPage(nextPage);
        handleUpdateProducts(nextPage);
    };

    const handleOnSearch = async (term: string) => {
        setIsLoading(true);
        setCurrentTerm(term);

        const { products: newProducts, count: newTotalProducts } = await listProducts(
            LIMIT,
            0,
            false,
            undefined,
            undefined,
            undefined,
            undefined,
            term
        );

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
                    <div className="flex flex-col w-full">
                        <SearchBar onSearch={handleOnSearch} />
                    </div>
                    {products.length > 0 && (
                        <div className="grid gap-4 grid-cols-1 xl:grid-cols-2">
                            {products.map((product) => (
                                <Product
                                    product={product}
                                    currentPage={page}
                                    key={`product-${product._id}`}
                                    updateProducts={handleUpdateProducts}
                                />
                            ))}
                        </div>
                    )}
                    {pageCount > 1 && (
                        <Pagination currentPage={page} pageCount={pageCount} handlePageNumber={handlePageNumber} />
                    )}
                </div>
            </div>
        </AccountWrapper>
    );
};

export default ProductsPage;
