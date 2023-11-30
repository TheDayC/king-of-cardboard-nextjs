import React from 'react';
import Link from 'next/link';
import { BsArrowDownCircle, BsBag, BsBoxSeam, BsHouseDoor } from 'react-icons/bs';

import { INTERESTS } from '../../../utils/constants';
import { IoNewspaperOutline } from 'react-icons/io5';

export const Navbar: React.FC = () => (
    <div className="navbar-center" role="navigation">
        <ul className="menu menu-horizontal hidden lg:inline-flex">
            <li>
                <Link href="/" passHref className="p-0 bg-neutral">
                    <button className="btn rounded-md gap-2" role="link">
                        <BsHouseDoor className="w-5 h-5" />
                        Home
                    </button>
                </Link>
            </li>
            <li>
                <Link href="/shop" passHref className="p-0 bg-neutral">
                    <button className="btn rounded-md gap-2" role="link">
                        <BsBag className="w-5 h-5" />
                        Shop
                        <BsArrowDownCircle className="w-4 h-4" />
                    </button>
                </Link>
                <ul className="bg-neutral z-50 rounded-md w-40 shadow">
                    {INTERESTS.map((menuItem, index) => {
                        let radius = 'rounded-none';

                        if (index === 0) {
                            radius = 'rounded-t-md';
                        }

                        if (index === INTERESTS.length - 1) {
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
                <Link href="/blog" passHref className="p-0 bg-neutral">
                    <button className="btn rounded-md gap-2" role="link">
                        <IoNewspaperOutline className="w-5 h-5" />
                        Blog
                    </button>
                </Link>
            </li>
            <li>
                <a
                    href="https://www.whatnot.com/user/kocardboard"
                    target="__blank"
                    rel="noopener noreferrer"
                    role="link"
                    className="p-0 bg-neutral"
                >
                    <button className="btn rounded-md gap-2" role="link">
                        <BsBoxSeam className="w-5 h-5" />
                        Breaks
                    </button>
                </a>
            </li>
        </ul>
    </div>
);

export default Navbar;
