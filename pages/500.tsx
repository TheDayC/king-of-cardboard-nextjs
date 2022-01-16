import React from 'react';
import Image from 'next/image';
import { MdOutlineMailOutline } from 'react-icons/md';

import PageWrapper from '../components/PageWrapper';
import crown from '../images/large-crown.png';

export const Custom500Page: React.FC = () => (
    <PageWrapper>
        <div className="flex flex-col w-full justify-start items-center">
            <div className="w-1/4 h-auto lg:block" role="img" data-testid="crown">
                <Image src={crown} alt="King of Cardboard Crown" title="King of Cardboard Crown" />
            </div>
            <div className="flex flex-col justify-start items-center p-4 text-lg">
                <h1 className="text-5xl mb-4 font-bold">500</h1>
                <h3 className="text-3xl mb-6 font-semibold">Internal Server Error</h3>
                <p className="mb-2">Something went wrong...</p>
                <p className="mb-6">Please drop support an email who will be able to investigate the problem.</p>
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

export default Custom500Page;
