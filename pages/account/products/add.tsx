import React from 'react';
import { GetServerSideProps } from 'next';
import { unstable_getServerSession } from 'next-auth';

import AccountWrapper from '../../../components/AccountWrapper';
import { authOptions } from '../../api/auth/[...nextauth]';
import { parseAsRole, safelyParse } from '../../../utils/parsers';
import { Roles } from '../../../enums/auth';
import ProductBody from '../../../components/Account/Product/add';

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
    const session = await unstable_getServerSession(req, res, authOptions);
    const role = safelyParse(session, 'user.role', parseAsRole, Roles.User);
    const isAdmin = role === Roles.Admin;

    if (!session || !isAdmin) {
        return {
            redirect: {
                permanent: false,
                destination: '/login',
            },
        };
    }

    return {
        props: {},
    };
};

export const AddProductsPage: React.FC = () => {
    return (
        <AccountWrapper title="Products - Account - King of Cardboard" description="Account page">
            <div className="flex flex-col w-full justify-start items-start p-2 md:p-4 md:p-8 md:flex-row">
                <div className="flex flex-col relative w-full space-y-4" data-testid="content">
                    <h1 className="text-3xl mb-4">Add Product</h1>
                    <ProductBody isNew />
                </div>
            </div>
        </AccountWrapper>
    );
};

export default AddProductsPage;
