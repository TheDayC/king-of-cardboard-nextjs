import React from 'react';
import { useSelector } from 'react-redux';
import { AiOutlineShoppingCart, AiFillHome, AiFillShopping, AiTwotoneCrown } from 'react-icons/ai';
import { BsFillRecord2Fill } from 'react-icons/bs';
import Image from 'next/image';
import Link from 'next/link';
import { useSession, signIn, signOut } from 'next-auth/react';
import { toSvg } from 'jdenticon';
import md5 from 'md5';

import selector from './selector';
import styles from './header.module.css';
import logo from '../../images/logo-full.png';

export const Header: React.FC = () => {
    const { cartItemCount } = useSelector(selector);
    const { data: session, status } = useSession();

    const handleLogout = () => {
        signOut();
    };

    return (
        <div className="navbar shadow-md bg-neutral text-neutral-content">
            <div className="navbar-start">
                <Link href="/" passHref>
                    <div className={styles.logoWrapper}>
                        <Image src={logo} alt="King of Cardboard Logo" title="King of Cardboard" />
                    </div>
                </Link>
            </div>
            <div className="navbar-center">
                <div className="items-stretch hidden lg:flex">
                    <Link href="/" passHref>
                        <button className="btn btn-ghost btn-sm rounded-btn pl-2 leading-4">
                            <AiFillHome className="inline-block w-6 h-6 mr-1.5 stroke-current" />
                            Home
                        </button>
                    </Link>
                    <Link href="/shop" passHref>
                        <button className="btn btn-ghost btn-sm rounded-btn pl-2 leading-4">
                            <AiFillShopping className="inline-block w-6 h-6 mr-1.5 stroke-current" />
                            Shop
                        </button>
                    </Link>
                    <Link href="/breaks" passHref>
                        <button className="btn btn-ghost btn-sm rounded-btn pl-2 leading-4">
                            <AiTwotoneCrown className="inline-block w-6 h-6 mr-1.5 stroke-current" />
                            Breaks
                        </button>
                    </Link>
                    <Link href="/streaming" passHref>
                        <button className="btn btn-ghost btn-sm rounded-btn pl-2 leading-4">
                            <BsFillRecord2Fill className="inline-block w-6 h-6 mr-1.5 stroke-current" />
                            Streaming
                        </button>
                    </Link>
                </div>
            </div>
            <div className="navbar-end">
                <Link href="/cart" passHref>
                    <div className="flex justify-start items-center indicator cursor-pointer rounded-md hover:bg-neutral-focus">
                        <AiOutlineShoppingCart className={styles.cart} />
                        {cartItemCount > 0 && <div className="indicator-item badge badge-primary">{cartItemCount}</div>}
                    </div>
                </Link>
                {status === 'unauthenticated' && <Link href="/login">Login</Link>}
                {status === 'authenticated' && (
                    <div className="dropdown dropdown-end">
                        <div className="avatar cursor-pointer relative" tabIndex={0}>
                            <div
                                className="rounded-full w-10 h-10 m-1 bg-white"
                                dangerouslySetInnerHTML={{ __html: toSvg(md5(session?.user?.email || ''), 40) }}
                            ></div>
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
    );
};

export default Header;
