import React, { ReactNode } from 'react';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { AiFillHome, AiFillShopping, AiTwotoneCrown } from 'react-icons/ai';
import { FaPlaneArrival } from 'react-icons/fa';

import logo from '../../images/logo-full.png';
import { parseAsString, safelyParse } from '../../utils/parsers';
import Rewards from '../Header/Rewards';
import selector from './selector';
import { setIsDrawerOpen } from '../../store/slices/global';
import { importsSubMenu, shopSubMenu } from '../../utils/constants';

interface DrawerProps {
    children: ReactNode;
}

export const Drawer: React.FC<DrawerProps> = ({ children }) => {
    const { isDrawerOpen } = useSelector(selector);
    const { data: session, status } = useSession();
    const dispatch = useDispatch();
    const router = useRouter();
    const email = safelyParse(session, 'user.email', parseAsString, null);

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
        <div className="bg-none drawer h-screen" data-testid="drawer">
            <input type="checkbox" className="drawer-toggle" checked={isDrawerOpen} onChange={handleToggle} />
            <div className="drawer-content">{children}</div>
            <div className="drawer-side">
                <label className="drawer-overlay" onClick={handleDrawerClick}></label>

                <ul className="menu menu-compact dropdown-content p-4 overflow-y-auto w-3/4 sm:w-1/2 md:w-1/4 bg-neutral text-base-content">
                    <li className="text-neutral-content mb-2" onClick={() => handleLinkClick('/')}>
                        <div className="w-3/4 xs:w-1/2 sm:w-3/4 md:w-full p-2 mx-auto">
                            <Image src={logo} alt="King of Cardboard Logo" title="King of Cardboard" />
                        </div>
                    </li>
                    {status === 'authenticated' && (
                        <li className="text-neutral-content mb-2">
                            <Rewards emailAddress={email} fullWidth />
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
                    {shopSubMenu.map((menuItem) => (
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
                        <button className="btn gap-1" onClick={() => handleLinkClick('/shop')}>
                            <FaPlaneArrival className="inline-block w-6 h-6 mr-1.5 stroke-current" />
                            Imports
                        </button>
                    </li>
                    <hr className="my-2" />
                    {importsSubMenu.map((menuItem) => (
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
                        <button className="btn rounded-btn px-4 w-full h-12" onClick={() => handleLinkClick('/breaks')}>
                            <AiTwotoneCrown className="inline-block w-6 h-6 mr-1.5 stroke-current" />
                            Breaks
                        </button>
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default Drawer;
