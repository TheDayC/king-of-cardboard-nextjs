import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { BiArrowBack } from 'react-icons/bi';
import { MdOutlineAccountCircle } from 'react-icons/md';

import logo from '../../../images/logo-full.png';
import { parseAsString, safelyParse } from '../../../utils/parsers';
import { toSvg } from 'jdenticon';
import md5 from 'md5';
import { Slugs } from '../../../enums/account';

export const Sidebar: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { data: session } = useSession();
    const router = useRouter();
    const icon = safelyParse(session, 'user.image', parseAsString, null);
    const name = safelyParse(session, 'user.name', parseAsString, null);
    const email = safelyParse(session, 'user.email', parseAsString, '');
    const orderNumber = safelyParse(router, 'query.orderNumber', parseAsString, null);
    const slug = safelyParse(router, 'query.slug', parseAsString, null);

    const handleAccountClick = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className="flex flex-col justify-between h-full">
            <ul className="menu menu-vertical">
                <li>
                    <Link href="/" passHref>
                        <div className="h-auto w-full cursor-pointer mb-2" role="link" data-testid="logo">
                            <Image src={logo} alt="King of Cardboard Logo Header" title="King of Cardboard" />
                        </div>
                    </Link>
                </li>
                <li className="hover-bordered text-white">
                    <Link href="/" passHref className="p-3 bg-neutral hover:bg-neutral-focus">
                        <BiArrowBack className="w-5 h-5" />
                        Back to website
                    </Link>
                </li>
            </ul>
            <div className="flex flex-col">
                <div className={`${isOpen ? 'h-72' : 'h-0'} overflow-hidden transition-all duration-500`}>
                    <ul className="menu menu-vertical">
                        <li
                            className={`${
                                slug === Slugs.Account || !slug ? 'bordered' : 'hover-bordered'
                            } text-white transition-all duration-300 hover:bg-neutral-focus`}
                            role="menuitem"
                        >
                            <Link href={{ pathname: '/account' }}>Account</Link>
                        </li>
                        <li
                            className={`${
                                slug === Slugs.Details ? 'bordered' : 'hover-bordered'
                            } text-white hover:bg-neutral-focus`}
                            role="menuitem"
                        >
                            <Link
                                href={{
                                    pathname: '/account/[slug]',
                                    query: { slug: Slugs.Details },
                                }}
                            >
                                Details
                            </Link>
                        </li>
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
                                slug === Slugs.OrderHistory || orderNumber ? 'bordered' : 'hover-bordered'
                            } text-white hover:bg-neutral-focus`}
                            role="menuitem"
                        >
                            <Link
                                href={{
                                    pathname: '/account/[slug]',
                                    query: { slug: Slugs.OrderHistory },
                                }}
                            >
                                Order History
                            </Link>
                        </li>
                        <li
                            className={`${
                                slug === Slugs.Achievements ? 'bordered' : 'hover-bordered'
                            } text-white hover:bg-neutral-focus`}
                            role="menuitem"
                        >
                            <Link
                                href={{
                                    pathname: '/account/[slug]',
                                    query: { slug: Slugs.Achievements },
                                }}
                            >
                                Achievements
                            </Link>
                        </li>
                    </ul>
                </div>
                <div
                    className="avatar cursor-pointer relative text-white p-2 pr-3 border-l-4 border-transparent w-full flex flex-row items-center justify-between hover:bg-neutral-focus hover:border-l-4 hover:border-primary"
                    onClick={handleAccountClick}
                >
                    <div
                        className="rounded-full w-8 h-8 mr-2 bg-white"
                        dangerouslySetInnerHTML={icon ? undefined : { __html: toSvg(md5(email), 32) }}
                    >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        {icon && <img src={icon || ''} alt="user icon" title="User Icon" />}
                    </div>
                    {name || email}
                    <MdOutlineAccountCircle className="w-6 h-6" />
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
