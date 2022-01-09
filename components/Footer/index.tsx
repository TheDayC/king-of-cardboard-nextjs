import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { BsTwitter, BsInstagram } from 'react-icons/bs';

import logo from '../../images/logo-full.png';

export const Footer: React.FC = () => (
    <div className="flex flex-col lg:flex-row bg-neutral text-base-200 p-4 lg:py-8">
        <div className="container mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 relative">
                <div className="flex flex-col items-center">
                    <Link href="/" passHref>
                        <div className="h-auto w-3/4 pointer block mb-4" data-testid="footer-logo">
                            <Image src={logo} alt="King of Cardboard Logo" title="King of Cardboard" />
                        </div>
                    </Link>
                    <p>Collect, Invest, Share.</p>
                </div>
                <div className="flex flex-col" role="menu">
                    <h4 className="text-lg">Information</h4>
                    <div className="divider whiteDivider my-2"></div>
                    <ul>
                        <li className="text-sm mb-2 hover:underline" role="menuitem">
                            <Link href="/what-is-king-of-cardboard">What is King of Cardboard?</Link>
                        </li>
                        <li className="text-sm mb-2 hover:underline" role="menuitem">
                            <Link href="/break-info">Break Info</Link>
                        </li>
                        <li className="text-sm mb-2 hover:underline" role="menuitem">
                            <Link href="/collecting">Collecting</Link>
                        </li>
                        <li className="text-sm mb-2 hover:underline" role="menuitem">
                            <Link href="/investing">Investing</Link>
                        </li>
                        <li className="text-sm mb-2 hover:underline" role="menuitem">
                            <Link href="/sports-vs-tcg">Sports vs TCG</Link>
                        </li>
                        <li className="text-sm mb-2 hover:underline" role="menuitem">
                            <Link href="/roadmap">Development Roadmap</Link>
                        </li>
                    </ul>
                </div>
                <div className="flex flex-col mx-4" role="menu">
                    <h4 className="text-lg">Customer Service</h4>
                    <div className="divider whiteDivider my-2"></div>
                    <ul>
                        <li className="text-sm mb-2 hover:underline" role="menuitem">
                            <Link href="/faq">FAQ</Link>
                        </li>
                        <li className="text-sm mb-2 hover:underline" role="menuitem">
                            <Link href="/shipping-and-delivery">Shipping &amp; Delivery</Link>
                        </li>
                        <li className="text-sm mb-2 hover:underline" role="menuitem">
                            <Link href="/returns-and-exchanges">Returns &amp; Exchanges</Link>
                        </li>
                        <li className="text-sm mb-2 hover:underline" role="menuitem">
                            <a href="mailto:admin@kingofcardboard.co.uk" target="__blank">
                                Contact Us
                            </a>
                        </li>
                        <li className="text-sm mb-2 hover:underline" role="menuitem">
                            <a href="mailto:admin@kingofcardboard.co.uk" target="__blank">
                                Submit Bug
                            </a>
                        </li>
                    </ul>
                </div>
                <div className="flex flex-col" role="menu">
                    <h4 className="text-lg">Legal</h4>
                    <div className="divider whiteDivider my-2"></div>
                    <ul>
                        <li className="text-sm mb-2 hover:underline" role="menuitem">
                            <Link href="/terms-and-conditions">Terms &amp; Conditions</Link>
                        </li>
                        <li className="text-sm mb-2 hover:underline" role="menuitem">
                            <Link href="/privacy-policy">Privacy Policy</Link>
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
            </div>
        </div>
    </div>
);

export default Footer;
