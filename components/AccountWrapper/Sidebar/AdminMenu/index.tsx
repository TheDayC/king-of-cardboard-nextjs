import React from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { AiOutlineShoppingCart } from 'react-icons/ai';
import { MdOutlineAdminPanelSettings } from 'react-icons/md';

import { parseAsRole, safelyParse } from '../../../../utils/parsers';
import { Roles } from '../../../../enums/auth';
import Title from '../Title';

export const AdminMenu: React.FC = () => {
    const { data: session } = useSession();
    const role = safelyParse(session, 'user.role', parseAsRole, Roles.User);

    if (role !== Roles.Admin) return null;

    return (
        <div className="flex flex-col">
            <Title title="Admin" Icon={MdOutlineAdminPanelSettings} />
            <ul className="menu menu-vertical">
                <li className="hover-bordered text-white">
                    <Link href="/account/products" passHref className="p-3 bg-neutral hover:bg-neutral-focus">
                        <AiOutlineShoppingCart className="w-5 h-5" />
                        Products
                    </Link>
                </li>
            </ul>
        </div>
    );
};

export default AdminMenu;
