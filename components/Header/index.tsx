import React from 'react';
import { useSelector } from 'react-redux';
import { AiOutlineShoppingCart, AiOutlineUser, AiOutlineMenu } from 'react-icons/ai';
import Image from 'next/image';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { toSvg } from 'jdenticon';
import md5 from 'md5';

import selector from './selector';
import styles from './header.module.css';
import logo from '../../images/logo-full.png';
import Rewards from './Rewards';
import { parseAsString, safelyParse } from '../../utils/parsers';
import NavBar from './Navbar';

export const Header: React.FC = () => {
    const { cartItemCount } = useSelector(selector);
    const { data: session, status } = useSession();
    const icon = safelyParse(session, 'user.image', parseAsString, null);
    const email = safelyParse(session, 'user.email', parseAsString, null);

    const handleLogout = () => {
        signOut();
    };

    return (
        <React.Fragment>
            <div className="navbar shadow-md bg-neutral text-neutral-content">
                <div className="navbar-start">
                    <label className="text-2xl px-2 lg:hidden" htmlFor="my-drawer">
                        <AiOutlineMenu />
                    </label>
                    <Link href="/" passHref>
                        <div className={styles.logoWrapper}>
                            <Image src={logo} alt="King of Cardboard Logo" title="King of Cardboard" />
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
                    <Link href="/cart" passHref>
                        <div className="flex justify-start items-center indicator cursor-pointer rounded-md hover:bg-neutral-focus">
                            <AiOutlineShoppingCart className={styles.cart} />
                            {cartItemCount > 0 && (
                                <div className="indicator-item badge badge-primary">{cartItemCount}</div>
                            )}
                        </div>
                    </Link>
                    {status === 'unauthenticated' && (
                        <Link href="/login" passHref>
                            <div className="flex justify-start items-center cursor-pointer rounded-md hover:bg-neutral-focus">
                                <AiOutlineUser className={styles.account} />
                            </div>
                        </Link>
                    )}
                    {status === 'authenticated' && (
                        <div className="dropdown dropdown-end">
                            <div className="avatar cursor-pointer relative" tabIndex={0}>
                                {icon ? (
                                    <div className="rounded-full w-8 h-8 m-1 bg-white">
                                        <img src={icon || ''} />
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
                                <li>
                                    <Link href="/account">Account</Link>
                                </li>
                                <li>
                                    <a onClick={handleLogout}>Log Out</a>
                                </li>
                            </ul>
                        </div>
                    )}
                </div>
            </div>
        </React.Fragment>
    );
};

export default Header;
