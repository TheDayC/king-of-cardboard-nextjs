import React from 'react';
import { useSelector } from 'react-redux';
import { AiOutlineShoppingCart } from 'react-icons/ai';

import selector from './selector';
import styles from './header.module.css';

export const Header: React.FC = () => {
    const { cartItemCount } = useSelector(selector);

    return (
        <div className="navbar mb-4 shadow-md bg-neutral text-neutral-content">
            <div className="flex-none px-2 mx-2">
                <img
                    src="/images/logo1x.png"
                    alt="King of Cardboard Logo"
                    title="King of Cardboard"
                    className={styles.logo}
                />
                <span className="text-lg font-bold">King of Cardboard</span>
            </div>
            <div className="flex-grow px-2 mx-2">
                <div className="items-stretch hidden lg:flex">
                    <a href="/" className="btn btn-ghost btn-sm rounded-btn">
                        Home
                    </a>
                    <a href="/shop" className="btn btn-ghost btn-sm rounded-btn">
                        Shop
                    </a>
                    <a href="/shop/sports" className="btn btn-ghost btn-sm rounded-btn">
                        Sports
                    </a>
                    <a href="/shop/tcg" className="btn btn-ghost btn-sm rounded-btn">
                        TCG
                    </a>
                    <a href="/breaks" className="btn btn-ghost btn-sm rounded-btn">
                        Breaks
                    </a>
                    <a href="/streaming" className="btn btn-ghost btn-sm rounded-btn">
                        Streaming
                    </a>
                </div>
            </div>
            <div className="flex-none px-2 mx-2">
                <button className="btn btn-ghost">
                    <a href="/cart">
                        <div className="flex justify-start items-center">
                            <AiOutlineShoppingCart className={styles.cart} />
                            {cartItemCount > 0 && <div className="badge ml-2 badge-outline">{cartItemCount}</div>}
                        </div>
                    </a>
                </button>
            </div>
        </div>
    );
};

export default Header;
