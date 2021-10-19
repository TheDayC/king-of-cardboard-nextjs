import React from 'react';
import { useSelector } from 'react-redux';
import { AiOutlineShoppingCart } from 'react-icons/ai';
import Image from 'next/image';
import Link from 'next/link';

import selector from './selector';
import styles from './header.module.css';
import logo from '../../images/logo-full.png';

export const Header: React.FC = () => {
    const { cartItemCount } = useSelector(selector);

    return (
        <div className="navbar mb-4 shadow-md bg-neutral text-neutral-content">
            <div className="navbar-start">
                <div className={styles.logoWrapper}>
                    <Link href="/" passHref>
                        <Image src={logo} alt="King of Cardboard Logo" title="King of Cardboard" />
                    </Link>
                </div>
            </div>
            <div className="navbar-center">
                <div className="items-stretch hidden lg:flex">
                    <Link href="/" passHref>
                        <button className="btn btn-ghost btn-sm rounded-btn">Home</button>
                    </Link>
                    <Link href="/shop" passHref>
                        <button className="btn btn-ghost btn-sm rounded-btn">Shop</button>
                    </Link>
                    <Link href="/shop/sports" passHref>
                        <button className="btn btn-ghost btn-sm rounded-btn">Sports</button>
                    </Link>
                    <Link href="/shop/tcg" passHref>
                        <button className="btn btn-ghost btn-sm rounded-btn">TCG</button>
                    </Link>
                    <Link href="/breaks" passHref>
                        <button className="btn btn-ghost btn-sm rounded-btn">Breaks</button>
                    </Link>
                    <Link href="/streaming" passHref>
                        <button className="btn btn-ghost btn-sm rounded-btn">Streaming</button>
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
            </div>
        </div>
    );
};

export default Header;
