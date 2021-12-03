import React from 'react';
import Link from 'next/link';
import { BiTrash, BiEdit } from 'react-icons/bi';

interface AddressProps {
    id: string;
    name: string;
}

export const Address: React.FC<AddressProps> = ({ id, name }) => {
    return (
        <div className="flex flex-col cursor-pointer p-6 border border-solid border-base-200 justify-center items-start w-full rounded-md shadow-md">
            <p className="text-sm mb-4">{name}</p>
            <div className="flex flex-row w-full justify-between">
                <Link href={`/account/editAddress/${id}`} passHref>
                    <button type="submit" className="btn btn-md rounded-md">
                        <BiEdit className="inline-block text-xl" />
                    </button>
                </Link>
                <Link href={`/account/deleteAddress/${id}`} passHref>
                    <button type="submit" className="btn btn-md btn-error rounded-md text-white">
                        <BiTrash className="inline-block text-xl" />
                    </button>
                </Link>
            </div>
        </div>
    );
};

export default Address;
