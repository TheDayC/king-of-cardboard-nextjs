import React from 'react';
import Link from 'next/link';
import { signOut } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';
import { MdOutlineAccountCircle } from 'react-icons/md';

import { parseAsString, safelyParse } from '../../../../utils/parsers';
import { Slugs } from '../../../../enums/account';
import { setUserId, setUserToken } from '../../../../store/slices/global';
import Title from '../Title';

export const AccountMenu: React.FC = () => {
    const dispatch = useDispatch();
    const router = useRouter();
    const slug = safelyParse(router, 'query.slug', parseAsString, null);

    const handleLogout = () => {
        dispatch(setUserToken(null));
        dispatch(setUserId(null));
        signOut();
    };

    return (
        <div className="flex flex-col">
            <Title title="Account" Icon={MdOutlineAccountCircle} />
            <ul className="menu menu-vertical">
                <li
                    className={`${
                        slug === Slugs.Profile ? 'bordered' : 'hover-bordered'
                    } text-white hover:bg-neutral-focus`}
                    role="menuitem"
                >
                    <Link
                        href={{
                            pathname: '/account/[slug]',
                            query: { slug: Slugs.Profile },
                        }}
                    >
                        Profile
                    </Link>
                </li>
                <li
                    className={`${
                        slug === Slugs.AddressBook ? 'bordered' : 'hover-bordered'
                    } text-white hover:bg-neutral-focus`}
                    role="menuitem"
                >
                    <Link
                        href={{
                            pathname: '/account/[slug]',
                            query: { slug: Slugs.AddressBook },
                        }}
                    >
                        Address Book
                    </Link>
                </li>
                <li
                    className={`${
                        router.pathname.includes('order-history') ? 'bordered' : 'hover-bordered'
                    } text-white hover:bg-neutral-focus`}
                    role="menuitem"
                >
                    <Link href="/account/order-history">Order History</Link>
                </li>
                <li
                    className={`${
                        router.pathname.includes('achievements') ? 'bordered' : 'hover-bordered'
                    } text-white hover:bg-neutral-focus`}
                    role="menuitem"
                >
                    <Link href="/account/achievements">Achievements</Link>
                </li>
                <li
                    className={`${
                        slug === Slugs.Achievements ? 'bordered' : 'hover-bordered'
                    } text-white hover:bg-neutral-focus`}
                    role="menuitem"
                >
                    <a onClick={handleLogout} data-testid="logout">
                        Log Out
                    </a>
                </li>
            </ul>
        </div>
    );
};

export default AccountMenu;
