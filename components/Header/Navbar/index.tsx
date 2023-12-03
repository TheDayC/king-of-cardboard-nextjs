import React, { useState } from 'react';
import Link from 'next/link';
import { BsBag, BsBoxSeam, BsHouseDoor } from 'react-icons/bs';
import { IoNewspaperOutline } from 'react-icons/io5';

import { INTERESTS } from '../../../utils/constants';

export const Navbar: React.FC = () => {
    const [shouldShow, setShouldShow] = useState(false);

    const handleShopMenuHover = (isHovered: boolean) => {
        setShouldShow(isHovered);
    };

    return (
        <ul className="menu menu-horizontal bg-neutral hidden lg:inline-flex p-0">
            <li>
                <Link href="/" passHref className="menu-link">
                    <BsHouseDoor className="w-5 h-5" />
                    Home
                </Link>
            </li>
            <li onMouseEnter={() => handleShopMenuHover(true)}>
                <details open={shouldShow}>
                    <summary className="menu-link">
                        <Link href="/shop" passHref className="flex flex-row items-center space-x-2">
                            <BsBag className="w-5 h-5" />
                            <span>Shop</span>
                        </Link>
                    </summary>
                    <ul
                        className="bg-neutral z-50 rounded-md w-40 shadow-md"
                        onMouseLeave={() => handleShopMenuHover(false)}
                    >
                        {INTERESTS.map((menuItem, index) => (
                            <li key={`nav-item-${index}`}>
                                <Link href={menuItem.href} passHref className="menu-link">
                                    <menuItem.icon className={`w-5 h-5 ${menuItem.css}`} />
                                    {menuItem.label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </details>
            </li>
            <li>
                <Link href="/blog" passHref className="menu-link">
                    <IoNewspaperOutline className="w-5 h-5" />
                    Blog
                </Link>
            </li>
            <li>
                <a
                    href="https://www.whatnot.com/user/kocardboard"
                    target="__blank"
                    rel="noopener noreferrer"
                    role="link"
                    className="menu-link"
                >
                    <BsBoxSeam className="w-5 h-5" />
                    Breaks
                </a>
            </li>
        </ul>
    );
};

export default Navbar;
