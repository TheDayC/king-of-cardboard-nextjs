import React from 'react';
import { AiFillHome, AiFillShopping, AiTwotoneCrown } from 'react-icons/ai';
import Link from 'next/link';

export const Navbar: React.FC = () => (
    <div className="navbar-center" role="navigation">
        <div className="items-stretch hidden lg:flex">
            <Link href="/" passHref>
                <button className="btn btn-ghost btn-sm rounded-btn pl-2 leading-4" role="link">
                    <AiFillHome className="inline-block w-6 h-6 mr-1.5 stroke-current" />
                    Home
                </button>
            </Link>
            <Link href="/shop" passHref>
                <button className="btn btn-ghost btn-sm rounded-btn pl-2 leading-4" role="link">
                    <AiFillShopping className="inline-block w-6 h-6 mr-1.5 stroke-current" />
                    Shop
                </button>
            </Link>
            <Link href="/breaks" passHref>
                <button className="btn btn-ghost btn-sm rounded-btn pl-2 leading-4" role="link">
                    <AiTwotoneCrown className="inline-block w-6 h-6 mr-1.5 stroke-current" />
                    Breaks
                </button>
            </Link>
        </div>
    </div>
);

export default Navbar;
