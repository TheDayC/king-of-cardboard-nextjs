import React from 'react';
import Link from 'next/link';
import { AiFillHome, AiFillShopping, AiTwotoneCrown } from 'react-icons/ai';
import { BsArrowDownCircle } from 'react-icons/bs';

import { shopSubMenu } from '../../../utils/constants';

export const Navbar: React.FC = () => (
    <div className="navbar-center" role="navigation">
        <ul className="menu menu-horizontal hidden lg:inline-flex">
            <li>
                <Link href="/" passHref className="p-0 bg-neutral">
                    <button className="btn rounded-md gap-2" role="link">
                        <AiFillHome className="w-5 h-5" />
                        Home
                    </button>
                </Link>
            </li>
            <li>
                <Link href="/shop" passHref className="p-0 bg-neutral">
                    <button className="btn rounded-md gap-2" role="link">
                        <AiFillShopping className="w-5 h-5" />
                        Shop
                        <BsArrowDownCircle className="w-4 h-4" />
                    </button>
                </Link>
                <ul className="bg-neutral z-50 rounded-md w-40 shadow">
                    {shopSubMenu.map((menuItem, index) => {
                        let radius = 'rounded-none';

                        if (index === 0) {
                            radius = 'rounded-t-md';
                        }

                        if (index === shopSubMenu.length - 1) {
                            radius = 'rounded-b-md';
                        }

                        return (
                            <li key={`nav-item-${index}`}>
                                <Link href={menuItem.href} passHref className="p-0 bg-neutral">
                                    <button className={`btn gap-2 p-2 w-full ${radius}`} role="link">
                                        <menuItem.icon className={`w-5 h-5 ${menuItem.css}`} />
                                        {menuItem.label}
                                    </button>
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </li>
            <li>
                <Link href="/breaks" passHref className="p-0 bg-neutral">
                    <button className="btn rounded-md gap-2" role="link">
                        <AiTwotoneCrown className="w-5 h-5" />
                        Breaks
                    </button>
                </Link>
            </li>
        </ul>
    </div>
);

export default Navbar;
