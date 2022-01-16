import React from 'react';
import Image from 'next/image';
import { MdOutlineMailOutline } from 'react-icons/md';

import crown from '../../../../images/large-crown.png';

export const NoProducts: React.FC = () => (
    <div className="flex flex-col w-full justify-start items-center">
        <div className="w-1/4 h-auto lg:block" role="img" data-testid="crown">
            <Image src={crown} alt="King of Cardboard Crown" title="King of Cardboard Crown" />
        </div>
        <div className="flex flex-col justify-start items-center p-4 text-lg">
            <h1 className="text-5xl mb-4 font-bold text-center">No Products</h1>
            <h3 className="text-3xl mb-6 font-semibold text-center">Please try filtering again.</h3>
            <p className="mb-2 text-center">
                We can&apos;t seem to find any products based on the filters you have selected! Please try adjusting the
                filters on this page to find out what we have on offer.
            </p>
            <p className="mb-6 text-center">
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
);

export default NoProducts;
