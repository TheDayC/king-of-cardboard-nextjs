import React, { useState } from 'react';
import { GetServerSideProps } from 'next';
import { unstable_getServerSession } from 'next-auth';
import Link from 'next/link';
import { MdAddCircleOutline } from 'react-icons/md';

import AccountWrapper from '../../../components/AccountWrapper';
import { authOptions } from '../../api/auth/[...nextauth]';
import { parseAsRole, safelyParse } from '../../../utils/parsers';
import { Roles } from '../../../enums/auth';
import Loading from '../../../components/Loading';
import Pagination from '../../../components/Pagination';
import Shipping from '../../../components/Account/Shipping';
import { listShippingMethods } from '../../../utils/account/shipping';
import { AccountShippingMethod } from '../../../types/shipping';

const LIMIT = 10;
const PAGE = 0;

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
    const session = await unstable_getServerSession(req, res, authOptions);
    const role = safelyParse(session, 'user.role', parseAsRole, Roles.User);
    const isAdmin = role === Roles.Admin;
    const { shippingMethods, count } = await listShippingMethods(LIMIT, PAGE, true);

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
            initialShippingMethods: shippingMethods,
            initialTotal: count,
        },
    };
};

interface ProductsPageProps {
    initialShippingMethods: AccountShippingMethod[];
    initialTotal: number;
}

export const ShippingPage: React.FC<ProductsPageProps> = ({ initialShippingMethods, initialTotal }) => {
    const [shippingMethods, setShippingMethods] = useState<AccountShippingMethod[]>(initialShippingMethods);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [count, setCount] = useState(LIMIT);
    const [page, setPage] = useState(PAGE);
    const [total, setTotal] = useState(initialTotal);
    const [isLoading, setIsLoading] = useState(false);
    const pageCount = total / LIMIT;

    const handleUpdate = async () => {
        setIsLoading(true);
        const { shippingMethods: newShippingMethods, count: newTotal } = await listShippingMethods(count, page);

        setShippingMethods(newShippingMethods);
        setTotal(newTotal);

        setIsLoading(false);
    };

    const handlePageNumber = (nextPage: number) => {
        setPage(nextPage);
        handleUpdate();
    };

    return (
        <AccountWrapper title="Shipping - Account - King of Cardboard" description="Account page">
            <div className="flex flex-col w-full justify-start items-start p-2 md:p-4 md:p-8 md:flex-row relative">
                {isLoading && <Loading show />}
                <div className="flex flex-col relative w-full space-y-4" data-testid="content">
                    <div className="flex flex-row justify-between items-center mb-4 pb-4 border-b border-solid border-gray-300">
                        <h1 className="text-3xl">Shipping</h1>
                        <Link href="/account/shipping/add" passHref>
                            <button className="btn btn-secondary rounded-md shadow-md">
                                <MdAddCircleOutline className="inline-block text-xl mr-2" />
                                Add shipping method
                            </button>
                        </Link>
                    </div>
                    {shippingMethods.length > 0 &&
                        shippingMethods.map((shippingMethod) => (
                            <Shipping
                                shippingMethod={shippingMethod}
                                key={`shipping-method-${shippingMethod._id}`}
                                updateShippingMethods={handleUpdate}
                            />
                        ))}
                    {pageCount > 1 && (
                        <Pagination currentPage={page} pageCount={pageCount} handlePageNumber={handlePageNumber} />
                    )}
                </div>
            </div>
        </AccountWrapper>
    );
};

export default ShippingPage;
