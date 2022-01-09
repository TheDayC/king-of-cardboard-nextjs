import React from 'react';
import { AiOutlineUser, AiOutlineMenu } from 'react-icons/ai';
import Image from 'next/image';
import Link from 'next/link';
import { signOut, useSession } from 'next-auth/react';
import { toSvg } from 'jdenticon';
import md5 from 'md5';

import logo from '../../images/logo-full.png';
import Rewards from './Rewards';
import { parseAsString, safelyParse } from '../../utils/parsers';
import NavBar from './Navbar';
import CartIcon from './CartIcon';
import NewsBanner from './NewsBanner';

export const Header: React.FC = () => {
    const session = useSession();
    const icon = safelyParse(session, 'data.user.image', parseAsString, null);
    const email = safelyParse(session, 'data.user.email', parseAsString, null);
    const status = safelyParse(session, 'status', parseAsString, 'unauthenticated');

    const handleLogout = () => {
        signOut();
    };

    return (
        <React.Fragment>
            <div className="navbar shadow-md bg-neutral text-neutral-content">
                <div className="navbar-start">
                    <label className="text-2xl px-2 lg:hidden" htmlFor="king-of-cardboard-drawer">
                        <AiOutlineMenu />
                    </label>
                    <Link href="/" passHref>
                        <div className="h-auto w-44 pointer lg:block" role="link" data-testid="logo">
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
                                <li role="menuitem">
                                    <Link href="/account">Account</Link>
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
            <NewsBanner />
        </React.Fragment>
    );
};

export default Header;
