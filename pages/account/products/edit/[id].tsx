import React from 'react';
import { GetServerSideProps } from 'next';
import { unstable_getServerSession } from 'next-auth';

import AccountWrapper from '../../../../components/AccountWrapper';
import { authOptions } from '../../../api/auth/[...nextauth]';
import { parseAsRole, parseAsString, safelyParse } from '../../../../utils/parsers';
import { Roles } from '../../../../enums/auth';
import ProductBody from '../../../../components/Account/Product/add';
import { getProduct } from '../../../../utils/account/products';
import { Product } from '../../../../types/productsNew';

export const getServerSideProps: GetServerSideProps = async ({ req, res, query }) => {
    const session = await unstable_getServerSession(req, res, authOptions);
    const role = safelyParse(session, 'user.role', parseAsRole, Roles.User);
    const isAdmin = role === Roles.Admin;
    const id = safelyParse(query, 'id', parseAsString, null);

    if (!session || !isAdmin || !id) {
        return {
            redirect: {
                permanent: false,
                destination: '/login',
            },
        };
    }

    const product = await getProduct(id);

    return {
        props: {
            product,
        },
    };
};

interface EditProductPageProps {
    product: Product;
}

export const EditProductPage: React.FC<EditProductPageProps> = ({ product }) => (
    <AccountWrapper title="Edit Product - Account - King of Cardboard" description="Edit product page">
        <div className="flex flex-col w-full justify-start items-start p-2 md:p-4 md:p-8 md:flex-row">
            <div className="flex flex-col relative w-full space-y-4" data-testid="content">
                <h1 className="text-3xl mb-4">Edit Product</h1>
                <ProductBody {...product} isNew={false} />
            </div>
        </div>
    </AccountWrapper>
);

export default EditProductPage;
