import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { BsTwitter, BsInstagram, BsFacebook } from 'react-icons/bs';
import { SiNextdotjs, SiTypescript, SiReact, SiRedux, SiMongodb } from 'react-icons/si';

import logo from '../../images/logo-full.png';

const builtOnClass = 'w-6 h-auto inline-block transition-colors duration-300 ease-in-out hover:text-primary';
const menuItemClass = 'transition duration-300 ease-in-out text-sm mb-2 hover:text-primary';

export const Footer: React.FC = () => (
    <div className="flex flex-col lg:flex-row bg-neutral text-base-200 p-4 lg:py-8">
        <div className="container mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 relative">
                <div className="flex flex-col items-center mx-2">
                    <Link href="/" passHref>
                        <div className="h-auto w-3/4 cursor-pointer block mb-4" data-testid="footer-logo">
                            <Image src={logo} alt="King of Cardboard Logo" title="King of Cardboard" />
                        </div>
                    </Link>
                    <p>Collect. Invest. Share.</p>
                    <div className="divider lightDivider my-4 w-full"></div>
                    <h3 className="text-md mb-2">Built on</h3>
                    <div className="flex flex-row flex-wrap items-between">
                        <div className="p-2">
                            <a href="https://nextjs.org/" target="__blank" role="link">
                                <SiNextdotjs className={builtOnClass} />
                            </a>
                        </div>
                        <div className="p-2">
                            <a href="https://www.typescriptlang.org/" target="__blank" role="link">
                                <SiTypescript className={builtOnClass} />
                            </a>
                        </div>
                        <div className="p-2">
                            <a href="https://reactjs.org/" target="__blank" role="link">
                                <SiReact className={builtOnClass} />
                            </a>
                        </div>
                        <div className="p-2">
                            <a href="https://redux.js.org/" target="__blank" role="link">
                                <SiRedux className={builtOnClass} />
                            </a>
                        </div>
                        <div className="p-2">
                            <a href="https://www.mongodb.com/" target="__blank" role="link">
                                <SiMongodb className={builtOnClass} />
                            </a>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col mx-2" role="menu">
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
                        <li className={menuItemClass} role="menuitem">
                            <Link href="/information/roadmap">Development Roadmap</Link>
                        </li>
                    </ul>
                </div>
                <div className="flex flex-col mx-2" role="menu">
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
                            <a href="mailto:support@kingofcardboard.co.uk" target="__blank">
                                Contact Us
                            </a>
                        </li>
                        <li className={menuItemClass} role="menuitem">
                            <a href="mailto:support@kingofcardboard.co.uk" target="__blank">
                                Submit Bug
                            </a>
                        </li>
                    </ul>
                </div>
                <div className="flex flex-col mx-2" role="menu">
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
            <div className="flex flex-row w-full items-center justify-center pt-6 space-x-6" data-testid="social-media">
                <a href="https://twitter.com/kocardboard" target="__blank" role="link">
                    <BsTwitter className="transition-colors duration-300 ease-in-out text-4xl hover:text-primary" />
                </a>
                <a href="https://instagram.com/kocardboard" target="__blank" role="link">
                    <BsInstagram className="transition-colors duration-300 ease-in-out text-4xl hover:text-primary" />
                </a>
                <a href="https://www.facebook.com/groups/kocardboardbreaks" target="__blank" role="link">
                    <BsFacebook className="transition-colors duration-300 ease-in-out text-4xl hover:text-primary" />
                </a>
            </div>
        </div>
    </div>
);

export default Footer;
