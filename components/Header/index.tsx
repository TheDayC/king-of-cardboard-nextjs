import React from 'react';
import { AiOutlineUser, AiOutlineMenu } from 'react-icons/ai';
import Image from 'next/image';
import Link from 'next/link';
import { signOut, useSession } from 'next-auth/react';
import { toSvg } from 'jdenticon';
import md5 from 'md5';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/router';

import logo from '../../images/logo-full.png';
import Rewards from './Rewards';
import { parseAsString, safelyParse } from '../../utils/parsers';
import NavBar from './Navbar';
import CartIcon from './CartIcon';
import { setIsDrawerOpen, setUserId, setUserToken } from '../../store/slices/global';
import { Slugs } from '../../enums/account';
//import IssueBanner from './IssueBanner';

export const Header: React.FC = () => {
    const dispatch = useDispatch();
    const { data: session, status } = useSession();
    const icon = safelyParse(session, 'user.image', parseAsString, null);
    const email = safelyParse(session, 'user.email', parseAsString, null);
    const router = useRouter();
    const slug = safelyParse(router, 'query.slug', parseAsString, null);
    const orderNumber = safelyParse(router, 'query.orderNumber', parseAsString, null);

    const handleLogout = () => {
        dispatch(setUserToken(null));
        dispatch(setUserId(null));
        signOut();
    };

    const handleDrawerClick = () => {
        dispatch(setIsDrawerOpen(true));
    };

    return (
        <React.Fragment>
            <div className="navbar shadow-md bg-neutral text-neutral-content">
                <div className="navbar-start">
                    <label className="text-2xl px-2 lg:hidden" onClick={handleDrawerClick}>
                        <AiOutlineMenu />
                    </label>
                    <Link href="/" passHref>
                        <div className="h-auto w-44 cursor-pointer lg:block" role="link" data-testid="logo">
                            <Image src={logo} alt="King of Cardboard Logo Header" title="King of Cardboard" />
                        </div>
                    </Link>
                </div>
                <NavBar />
                <div className="navbar-end">
                    {status === 'authenticated' && (
                        <div className="hidden lg:inline-block">
                            <Rewards emailAddress={email} fullWidth={false} />
                        </div>
                    )}
                    <CartIcon />
                    {status === 'authenticated' ? (
                        <div className="dropdown dropdown-end" role="menu" data-testid="account-dropdown">
                            <div className="avatar cursor-pointer relative" tabIndex={0}>
                                {icon ? (
                                    <div className="rounded-full w-8 h-8 m-1 bg-white">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img src={icon || ''} alt="user icon" title="User Icon" />
                                    </div>
                                ) : (
                                    <div
                                        className="rounded-full w-8 h-8 m-1 bg-white"
                                        dangerouslySetInnerHTML={{ __html: toSvg(md5(email || ''), 32) }}
                                    ></div>
                                )}
                            </div>
                            <ul
                                tabIndex={0}
                                className="p-2 shadow menu dropdown-content bg-base-100 rounded-md w-52 text-base-content"
                            >
                                <li
                                    className={`${slug === Slugs.Account ? 'bordered' : 'hover-bordered'}`}
                                    role="menuitem"
                                >
                                    <Link href={{ pathname: '/account' }}>Account</Link>
                                </li>
                                <li
                                    className={`${slug === Slugs.Details ? 'bordered' : 'hover-bordered'}`}
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
                                    className={`${slug === Slugs.Profile ? 'bordered' : 'hover-bordered'}`}
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
                                    className={`${slug === Slugs.AddressBook ? 'bordered' : 'hover-bordered'}`}
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
                                    }`}
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
                                    className={`${slug === Slugs.Achievements ? 'bordered' : 'hover-bordered'}`}
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
                                <li role="menuitem">
                                    <a onClick={handleLogout} data-testid="logout">
                                        Log Out
                                    </a>
                                </li>
                            </ul>
                        </div>
                    ) : (
                        <Link href="/login" passHref>
                            <div
                                className="flex justify-start items-center cursor-pointer rounded-md hover:bg-neutral-focus"
                                role="button"
                                data-testid="login-icon"
                            >
                                <div className="p-2 text-2xl">
                                    <AiOutlineUser />
                                </div>
                            </div>
                        </Link>
                    )}
                </div>
            </div>
            {/* <IssueBanner /> */}
        </React.Fragment>
    );
};

export default Header;
