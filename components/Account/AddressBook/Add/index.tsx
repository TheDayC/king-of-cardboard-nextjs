import React from 'react';
import { MdAddCircleOutline } from 'react-icons/md';
import Link from 'next/link';

export const Add: React.FC = () => (
    <Link
        href={{
            pathname: '/account/[slug]',
            query: { slug: 'addAddress' },
        }}
        passHref
    >
        <div className="flex flex-col cursor-pointer p-6 border border-solid border-base-200 justify-center items-center w-full rounded-md shadow-md">
            <MdAddCircleOutline className="mb-2 text-2xl" />
            <p>Add new address</p>
        </div>
    </Link>
);

export default Add;
