import React, { ReactNode } from 'react';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { AiFillHome, AiFillShopping, AiTwotoneCrown } from 'react-icons/ai';

import logo from '../../images/logo-full.webp';
import Rewards from '../Header/Rewards';
import selector from './selector';
import { setIsDrawerOpen } from '../../store/slices/global';
import { INTERESTS } from '../../utils/constants';

interface DrawerProps {
    children: ReactNode;
}

export const Drawer: React.FC<DrawerProps> = ({ children }) => {
    const { isDrawerOpen } = useSelector(selector);
    const { status } = useSession();
    const dispatch = useDispatch();
    const router = useRouter();

    const handleDrawerClick = () => {
        dispatch(setIsDrawerOpen(!isDrawerOpen));
    };

    const handleLinkClick = (href: string) => {
        handleDrawerClick();
        router.push(href);
    };

    const handleToggle = () => {
        return;
    };

    return (
        <div className="bg-none drawer h-screen overflow-auto xl:overflow-hiden" data-testid="drawer">
            <input type="checkbox" className="drawer-toggle" checked={isDrawerOpen} onChange={handleToggle} />
            <div className="drawer-content">{children}</div>
            <div className="drawer-side">
                <label className="drawer-overlay" onClick={handleDrawerClick}></label>
                <div className="w-3/4">
                    <ul className="menu menu-compact p-4 overflow-y-auto w-full bg-neutral text-base-content">
                        <li className="text-neutral-content mb-2" onClick={() => handleLinkClick('/')}>
                            <div className="w-3/4 xs:w-1/2 sm:w-3/4 md:w-full p-2 mx-auto">
                                <Image src={logo} alt="King of Cardboard Logo" title="King of Cardboard" />
                            </div>
                        </li>
                        {status === 'authenticated' && (
                            <li className="text-neutral-content mb-2">
                                <Rewards fullWidth />
                            </li>
                        )}
                        <li className="text-neutral-content mb-4">
                            <button className="btn gap-1" onClick={() => handleLinkClick('/')}>
                                <AiFillHome className="inline-block w-6 h-6 mr-1.5 stroke-current" />
                                Home
                            </button>
                        </li>
                        <li className="text-neutral-content mb-2">
                            <button className="btn gap-1" onClick={() => handleLinkClick('/shop')}>
                                <AiFillShopping className="inline-block w-6 h-6 mr-1.5 stroke-current" />
                                Shop
                            </button>
                        </li>
                        <hr className="my-2" />
                        {INTERESTS.map((menuItem) => (
                            <li className="text-neutral-content" key={`sub-menu-item-${menuItem.label}`}>
                                <button
                                    className="btn gap-1 rounded-sm"
                                    onClick={() => handleLinkClick(menuItem.href)}
                                    role="link"
                                >
                                    <menuItem.icon className={`w-5 h-5 ${menuItem.css}`} />
                                    {menuItem.label}
                                </button>
                            </li>
                        ))}
                        <hr className="my-2" />
                        <li className="text-neutral-content mb-2">
                            <a
                                href="https://www.whatnot.com/user/kocardboard"
                                target="__blank"
                                rel="noopener noreferrer"
                                role="link"
                            >
                                <button className="btn rounded-btn px-4 w-full h-12">
                                    <AiTwotoneCrown className="inline-block w-6 h-6 mr-1.5 stroke-current" />
                                    Breaks
                                </button>
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Drawer;
