import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { BsTwitter, BsInstagram, BsFacebook, BsTiktok } from 'react-icons/bs';
import { SiNextdotjs, SiTypescript, SiReact, SiRedux, SiMongodb } from 'react-icons/si';

import logo from '../../images/logo-full.webp';
import { FaCcAmex, FaCcDiscover, FaCcMastercard, FaCcPaypal, FaCcVisa } from 'react-icons/fa';

const menuItemClass = 'transition duration-300 ease-in-out text-sm mb-2 hover:text-primary';
const iconClass = 'transition-colors duration-300 ease-in-out text-4xl hover:text-primary';

export const Footer: React.FC = () => (
    <div className="flex flex-col lg:flex-row bg-neutral text-base-200 p-4 lg:py-8">
        <div className="container mx-auto">
            <div className="grid grid-cols-1 gap-y-4 relative mb-6 xl:grid-cols-4 xl:gap-x-4">
                <div className="flex flex-col items-center justify-center">
                    <Link href="/" passHref>
                        <div className="cursor-pointer block mb-4" data-testid="footer-logo">
                            <Image src={logo} alt="King of Cardboard Logo" title="King of Cardboard" width={240} />
                        </div>
                    </Link>
                    <p className="text-2xl">Collect. Invest. Share.</p>
                </div>
                <div className="flex flex-col" role="menu">
                    <h4 className="text-lg">Information</h4>
                    <div className="divider lightDivider my-2"></div>
                    <ul>
                        <li className={menuItemClass} role="menuitem">
                            <Link href="/information/what-is-king-of-cardboard">What is King of Cardboard?</Link>
                        </li>
                        <li className={menuItemClass} role="menuitem">
                            <Link href="/information/break-info">Break Info</Link>
                        </li>
                        <li className={menuItemClass} role="menuitem">
                            <Link href="/information/collecting">Collecting</Link>
                        </li>
                        <li className={menuItemClass} role="menuitem">
                            <Link href="/information/investing">Investing</Link>
                        </li>
                        <li className={menuItemClass} role="menuitem">
                            <Link href="/information/rarities-parallels-patches-and-autographs">
                                Rarities, Parallels, Patches and Autographs
                            </Link>
                        </li>
                    </ul>
                </div>
                <div className="flex flex-col" role="menu">
                    <h4 className="text-lg">Customer Service</h4>
                    <div className="divider lightDivider my-2"></div>
                    <ul>
                        <li className={menuItemClass} role="menuitem">
                            <Link href="/customer-service/faq">FAQ</Link>
                        </li>
                        <li className={menuItemClass} role="menuitem">
                            <Link href="/customer-service/shipping-and-delivery">Shipping &amp; Delivery</Link>
                        </li>
                        <li className={menuItemClass} role="menuitem">
                            <Link href="/customer-service/returns-and-exchanges">Returns &amp; Exchanges</Link>
                        </li>
                        <li className={menuItemClass} role="menuitem">
                            <a href="mailto:support@kingofcardboard.co.uk" target="__blank" rel="noopener noreferrer">
                                Contact Us
                            </a>
                        </li>
                        <li className={menuItemClass} role="menuitem">
                            <a href="mailto:support@kingofcardboard.co.uk" target="__blank" rel="noopener noreferrer">
                                Submit Bug
                            </a>
                        </li>
                    </ul>
                </div>
                <div className="flex flex-col" role="menu">
                    <h4 className="text-lg">Legal</h4>
                    <div className="divider lightDivider my-2"></div>
                    <ul>
                        <li className={menuItemClass} role="menuitem">
                            <Link href="/legal/terms-and-conditions">Terms &amp; Conditions</Link>
                        </li>
                        <li className={menuItemClass} role="menuitem">
                            <Link href="/legal/privacy-policy">Privacy Policy</Link>
                        </li>
                    </ul>
                </div>
            </div>
            <div className="flex flex-col w-full items-center justify-between gap-y-8 xl:gap-x-6 xl:flex-row">
                <div className="flex flex-col items-center gap-y-2">
                    <h4 className="text-lg">Follow us on social media</h4>
                    <div className="flex flex-row items-center justify-center gap-x-6">
                        <a
                            href="https://www.tiktok.com/@kocardboard"
                            target="__blank"
                            rel="noopener noreferrer"
                            role="link"
                        >
                            <BsTiktok className={iconClass} title="Tiktok" />
                        </a>
                        <a
                            href="https://twitter.com/kocardboard"
                            target="__blank"
                            rel="noopener noreferrer"
                            role="link"
                        >
                            <BsTwitter className={iconClass} title="Twitter" />
                        </a>
                        <a
                            href="https://instagram.com/kocardboard"
                            target="__blank"
                            rel="noopener noreferrer"
                            role="link"
                        >
                            <BsInstagram className={iconClass} title="Instagram" />
                        </a>
                        <a
                            href="https://www.facebook.com/groups/kocardboardbreaks"
                            target="__blank"
                            rel="noopener noreferrer"
                            role="link"
                        >
                            <BsFacebook className={iconClass} title="Facebook" />
                        </a>
                    </div>
                </div>

                <div className="flex flex-col items-center gap-y-2">
                    <h4 className="text-lg">Built on</h4>
                    <div className="flex flex-row items-center gap-x-4">
                        <a href="https://nextjs.org/" target="__blank" rel="noopener noreferrer" role="link">
                            <SiNextdotjs className={iconClass} title="NextJS logo" />
                        </a>
                        <a
                            href="https://www.typescriptlang.org/"
                            target="__blank"
                            rel="noopener noreferrer"
                            role="link"
                        >
                            <SiTypescript className={iconClass} title="Typescript logo" />
                        </a>
                        <a href="https://reactjs.org/" target="__blank" rel="noopener noreferrer" role="link">
                            <SiReact className={iconClass} title="React logo" />
                        </a>
                        <a href="https://redux.js.org/" target="__blank" rel="noopener noreferrer" role="link">
                            <SiRedux className={iconClass} title="Redux logo" />
                        </a>
                        <a href="https://www.mongodb.com/" target="__blank" rel="noopener noreferrer" role="link">
                            <SiMongodb className={iconClass} title="MongoDB logo" />
                        </a>
                    </div>
                </div>
                <div className="flex flex-col items-center">
                    <h4 className="text-lg">We accept all major credit cards</h4>
                    <div className="flex flex-row items-center gap-x-2">
                        <FaCcMastercard className={iconClass} title="Mastercard" />
                        <FaCcVisa className={iconClass} title="Visa" />
                        <FaCcDiscover className={iconClass} title="Discover" />
                        <FaCcAmex className={iconClass} title="American Express" />
                        <FaCcPaypal className={iconClass} title="PayPal" />
                    </div>
                </div>
            </div>
        </div>
    </div>
);

export default Footer;
