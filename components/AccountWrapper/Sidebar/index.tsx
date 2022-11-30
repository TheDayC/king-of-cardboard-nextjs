import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { BiArrowBack } from 'react-icons/bi';
import { signOut, useSession } from 'next-auth/react';

import logo from '../../../images/logo-full.png';
import { parseAsString, safelyParse } from '../../../utils/parsers';
import { toSvg } from 'jdenticon';
import md5 from 'md5';

export const Sidebar: React.FC = () => {
    const { data: session, status } = useSession();
    console.log('🚀 ~ file: index.tsx ~ line 14 ~ session', session);
    const isAuthenticated = status === 'authenticated';
    const icon = safelyParse(session, 'user.image', parseAsString, null);
    const name = safelyParse(session, 'user.name', parseAsString, null);
    const email = safelyParse(session, 'user.email', parseAsString, '');

    return (
        <div className="navbar-center" role="navigation">
            <ul className="menu menu-vertical hidden lg:inline-flex">
                <li>
                    <Link href="/" passHref>
                        <div className="h-auto w-full cursor-pointer mb-2" role="link" data-testid="logo">
                            <Image src={logo} alt="King of Cardboard Logo Header" title="King of Cardboard" />
                        </div>
                    </Link>
                </li>
                <li>
                    <Link href="/" passHref className="p-0 bg-neutral">
                        <button className="btn btn-block rounded-none gap-2 no-animation justify-start" role="link">
                            <BiArrowBack className="w-5 h-5" />
                            Back to website
                        </button>
                    </Link>
                </li>
                {isAuthenticated && (
                    <li>
                        <div
                            className="avatar cursor-pointer relative text-white p-2 hover:bg-neutral-focus"
                            tabIndex={0}
                        >
                            <div
                                className="rounded-full w-6 h-6 m-1 bg-white"
                                dangerouslySetInnerHTML={icon ? undefined : { __html: toSvg(md5(email), 32) }}
                            >
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                {icon && <img src={icon || ''} alt="user icon" title="User Icon" />}
                            </div>
                            {name || email}
                        </div>
                    </li>
                )}
            </ul>
        </div>
    );
};

export default Sidebar;
