import React from 'react';
import { CgDetailsMore } from 'react-icons/cg';
import { BsFillPersonLinesFill, BsFillCartCheckFill, BsFillAwardFill } from 'react-icons/bs';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { get } from 'lodash';

export const AccountMenu: React.FC = () => {
    const router = useRouter();
    const slug = get(router, 'query.slug', null);

    return (
        <ul className="menu p-4 shadow-lg bg-base-100 rounded-md">
            <li className="menu-title">
                <span>Account Menu</span>
            </li>
            <li className={`${slug === 'details' ? 'bordered' : 'hover-bordered'}`}>
                <Link href="/account/details" passHref>
                    <a>
                        <CgDetailsMore className="inline-block w-5 h-5 mr-2 stroke-current" />
                        Details
                    </a>
                </Link>
            </li>
            <li className={`${slug === 'profile' ? 'bordered' : 'hover-bordered'}`}>
                <Link href="/account/profile" passHref>
                    <a>
                        <BsFillPersonLinesFill className="inline-block w-5 h-5 mr-2 stroke-current" />
                        Profile
                    </a>
                </Link>
            </li>
            <li className={`${slug === 'orderHistory' ? 'bordered' : 'hover-bordered'}`}>
                <Link href="/account/orderHistory" passHref>
                    <a>
                        <BsFillCartCheckFill className="inline-block w-5 h-5 mr-2 stroke-current" />
                        Order History
                    </a>
                </Link>
            </li>
            <li className={`${slug === 'achievements' ? 'bordered' : 'hover-bordered'}`}>
                <Link href="/account/achievements" passHref>
                    <a>
                        <BsFillAwardFill className="inline-block w-5 h-5 mr-2 stroke-current" />
                        Achievements
                    </a>
                </Link>
            </li>
        </ul>
    );
};

export default AccountMenu;
