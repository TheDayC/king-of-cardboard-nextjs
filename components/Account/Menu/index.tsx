import React from 'react';
import { CgDetailsMore } from 'react-icons/cg';
import { BsFillPersonLinesFill, BsFillCartCheckFill, BsFillAwardFill, BsFillHouseDoorFill } from 'react-icons/bs';
import { useRouter } from 'next/router';
import Link from 'next/link';

import { parseAsString, safelyParse } from '../../../utils/parsers';
import { Slugs } from '../../../enums/account';

export const AccountMenu: React.FC = () => {
    const router = useRouter();
    const slug = safelyParse(router, 'query.slug', parseAsString, null);
    const orderNumber = safelyParse(router, 'query.orderNumber', parseAsString, null);

    return (
        <ul className="menu p-4 shadow-lg bg-base-100 rounded-md">
            <li className={`${slug === Slugs.Details ? 'bordered' : 'hover-bordered'}`}>
                <Link href={`/account/${Slugs.Details}`} passHref>
                    <a>
                        <CgDetailsMore className="inline-block w-5 h-5 mr-2 stroke-current" />
                        Details
                    </a>
                </Link>
            </li>
            <li className={`${slug === Slugs.Profile ? 'bordered' : 'hover-bordered'}`}>
                <Link href={`/account/${Slugs.Profile}`} passHref>
                    <a>
                        <BsFillPersonLinesFill className="inline-block w-5 h-5 mr-2 stroke-current" />
                        Profile
                    </a>
                </Link>
            </li>
            <li className={`${slug === Slugs.AddressBook ? 'bordered' : 'hover-bordered'}`}>
                <Link href={`/account/${Slugs.AddressBook}`} passHref>
                    <a>
                        <BsFillHouseDoorFill className="inline-block w-5 h-5 mr-2 stroke-current" />
                        Address Book
                    </a>
                </Link>
            </li>
            <li className={`${slug === Slugs.OrderHistory || orderNumber ? 'bordered' : 'hover-bordered'}`}>
                <Link href={`/account/${Slugs.OrderHistory}`} passHref>
                    <a>
                        <BsFillCartCheckFill className="inline-block w-5 h-5 mr-2 stroke-current" />
                        Order History
                    </a>
                </Link>
            </li>
            <li className={`${slug === Slugs.Achievements ? 'bordered' : 'hover-bordered'}`}>
                <Link href={`/account/${Slugs.Achievements}`} passHref>
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
