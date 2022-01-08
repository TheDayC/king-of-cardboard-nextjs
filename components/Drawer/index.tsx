import React from 'react';
import { AiFillHome, AiFillShopping, AiTwotoneCrown } from 'react-icons/ai';
import { BsFillRecord2Fill } from 'react-icons/bs';
import Link from 'next/link';
import Image from 'next/image';
import { useSession } from 'next-auth/react';

import logo from '../../images/logo-full.png';
import { parseAsString, safelyParse } from '../../utils/parsers';
import Rewards from '../Header/Rewards';

export const Drawer: React.FC = ({ children }) => {
    const session = useSession();
    const email = safelyParse(session, 'data.user.email', parseAsString, null);

    return (
        <div className="bg-none drawer h-screen" data-testid="drawer">
            <input id="king-of-cardboard-drawer" type="checkbox" className="drawer-toggle" />
            <div className="drawer-content">{children}</div>
            <div className="drawer-side">
                <label htmlFor="my-drawer" className="drawer-overlay"></label>

                <ul className="menu p-4 overflow-y-auto w-3/4 sm:w-1/2 md:w-1/4 bg-neutral text-base-content">
                    <li className="text-neutral-content mb-2">
                        <Link href="/" passHref>
                            <div className="w-3/4 xs:w-1/2 sm:w-3/4 md:w-full p-2 mx-auto">
                                <Image src={logo} alt="King of Cardboard Logo" title="King of Cardboard" />
                            </div>
                        </Link>
                    </li>
                    {session && session.status === 'authenticated' && (
                        <li className="text-neutral-content mb-2">
                            <Rewards emailAddress={email} fullWidth />
                        </li>
                    )}
                    <li className="text-neutral-content mb-4">
                        <Link href="/" passHref>
                            <button className="btn btn-ghost btn-sm rounded-btn px-4 w-full h-12">
                                <AiFillHome className="inline-block w-6 h-6 mr-1.5 stroke-current" />
                                Home
                            </button>
                        </Link>
                    </li>
                    <li className="text-neutral-content mb-2">
                        <Link href="/shop" passHref>
                            <button className="btn btn-ghost btn-sm rounded-btn px-4 w-full h-12">
                                <AiFillShopping className="inline-block w-6 h-6 mr-1.5 stroke-current" />
                                Shop
                            </button>
                        </Link>
                    </li>
                    <li className="text-neutral-content mb-2">
                        <Link href="/breaks" passHref>
                            <button className="btn btn-ghost btn-sm rounded-btn px-4 w-full h-12">
                                <AiTwotoneCrown className="inline-block w-6 h-6 mr-1.5 stroke-current" />
                                Breaks
                            </button>
                        </Link>
                    </li>
                    <li className="text-neutral-content mb-2">
                        <a href="https://twitch.tv/dayc" target="_blank" rel="noreferrer">
                            <button className="btn btn-ghost btn-sm rounded-btn px-4 w-full h-12">
                                <BsFillRecord2Fill className="inline-block w-6 h-6 mr-1.5 stroke-current" />
                                Streaming
                            </button>
                        </a>
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default Drawer;
