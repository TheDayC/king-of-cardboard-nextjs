import React from 'react';
import { GetServerSideProps } from 'next';
import { unstable_getServerSession } from 'next-auth';

import AccountWrapper from '../../../components/AccountWrapper';
import { authOptions } from '../../api/auth/[...nextauth]';
import { parseAsRole, parseAsString, safelyParse } from '../../../utils/parsers';
import { Roles } from '../../../enums/auth';
import { Order } from '../../../types/orders';
import { getOrderById } from '../../../utils/account/order';
import { isOrder } from '../../../utils/typeguards';
import OrderBody from '../../../components/Account/Order/body';
import { listShippingMethods } from '../../../utils/account/shipping';
import { AccountShippingMethod } from '../../../types/shipping';

const LIMIT = 10;
const PAGE = 0;

export const getServerSideProps: GetServerSideProps = async ({ req, res, query }) => {
    const session = await unstable_getServerSession(req, res, authOptions);
    const role = safelyParse(session, 'user.role', parseAsRole, Roles.User);
    const isAdmin = role === Roles.Admin;
    const { shippingMethods } = await listShippingMethods(LIMIT, PAGE);

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
            shippingMethods,
        },
    };
};

interface AddOrderPageProps {
    shippingMethods: AccountShippingMethod[];
}

export const AddOrderPage: React.FC<AddOrderPageProps> = ({ shippingMethods }) => (
    <AccountWrapper title="Edit Product - Account - King of Cardboard" description="Edit product page">
        <div className="flex flex-col w-full justify-start items-start p-2 md:p-4 md:p-8 md:flex-row">
            <div className="flex flex-col relative w-full space-y-4" data-testid="content">
                <h1 className="text-5xl border-b border-gray-400 pb-4">Edit order</h1>
                <OrderBody shippingMethods={shippingMethods} isNew />
            </div>
        </div>
    </AccountWrapper>
);

export default AddOrderPage;
