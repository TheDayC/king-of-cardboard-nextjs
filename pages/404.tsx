import React from 'react';
import Image from 'next/image';
import { MdOutlineMailOutline } from 'react-icons/md';

import PageWrapper from '../components/PageWrapper';
import crown from '../images/large-crown.png';

export const Custom404Page: React.FC = () => (
    <PageWrapper>
        <div className="flex flex-col w-full justify-start items-center">
            <div className="w-1/4 h-auto lg:block" role="img" data-testid="crown">
                <Image src={crown} alt="King of Cardboard Crown" title="King of Cardboard Crown" />
            </div>
            <div className="flex flex-col justify-start items-center p-4 text-lg">
                <h1 className="text-5xl mb-2 font-bold">404</h1>
                <h3 className="text-3xl mb-6 font-semibold">Page not found</h3>
                <p className="mb-2">We can&apos;t seem to find the page you requested!</p>
                <p className="mb-2">
                    Try using the menu links in the header or footer of the site to find what you&apos;re looking for.
                </p>
                <p className="mb-6">
                    If you believe this page is showing in error please drop support an email who will be able to
                    investigate.
                </p>
                <p className="text-xl">
                    <MdOutlineMailOutline className="inline-block mr-2 text-3xl" />
                    <a href="mailto:support@kingofcardboard.co.uk" className="hover:underline">
                        support@kingofcardboard.co.uk
                    </a>
                </p>
            </div>
        </div>
    </PageWrapper>
);

export default Custom404Page;
