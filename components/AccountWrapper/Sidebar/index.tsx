import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import { BiArrowBack } from 'react-icons/bi';
import { MdOutlineAccountCircle } from 'react-icons/md';
import { toSvg } from 'jdenticon';
import md5 from 'md5';

import logo from '../../../images/logo-full.webp';
import { parseAsString, safelyParse } from '../../../utils/parsers';
import AdminMenu from './AdminMenu';
import AccountMenu from './AccountMenu';
import { Slugs } from '../../../enums/account';

export const Sidebar: React.FC = () => {
    const { data: session } = useSession();
    const icon = safelyParse(session, 'user.image', parseAsString, null);
    const name = safelyParse(session, 'user.name', parseAsString, null);
    const email = safelyParse(session, 'user.email', parseAsString, '');

    return (
        <div className="flex flex-col justify-between space-y-4">
            <ul className="menu menu-vertical">
                <li>
                    <Link href="/" passHref>
                        <div className="h-auto w-full cursor-pointer mb-2" role="link" data-testid="logo">
                            <Image src={logo} alt="King of Cardboard Logo Header" title="King of Cardboard" />
                        </div>
                    </Link>
                </li>
                <li className="hover-bordered text-white">
                    <Link href="/" passHref className="p-3 bg-neutral hover:bg-neutral-focus">
                        <BiArrowBack className="w-5 h-5" />
                        Back to website
                    </Link>
                </li>
            </ul>
            <AdminMenu />
            <AccountMenu />
            <Link
                href={{
                    pathname: '/account/[slug]',
                    query: { slug: Slugs.Details },
                }}
            >
                <div className="avatar cursor-pointer relative text-white p-2 pr-3 border-l-4 border-transparent w-full flex flex-row items-center justify-between hover:bg-neutral-focus hover:border-l-4 hover:border-primary">
                    <div
                        className="rounded-full w-8 h-8 mr-2 bg-white"
                        dangerouslySetInnerHTML={icon ? undefined : { __html: toSvg(md5(email), 32) }}
                    >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        {icon && <img src={icon || ''} alt="user icon" title="User Icon" />}
                    </div>
                    {name || email}
                    <MdOutlineAccountCircle className="w-6 h-6" />
                </div>
            </Link>
        </div>
    );
};

export default Sidebar;
