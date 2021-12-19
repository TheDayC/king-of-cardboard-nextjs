import React from 'react';
import { AiFillHome, AiFillShopping, AiTwotoneCrown } from 'react-icons/ai';
import { BsFillRecord2Fill } from 'react-icons/bs';
import Link from 'next/link';

export const Navbar: React.FC = () => (
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
);

export default Navbar;
