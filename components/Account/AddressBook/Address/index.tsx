import React from 'react';
import Link from 'next/link';

interface AddressProps {
    id: string;
    name: string;
}

export const Address: React.FC<AddressProps> = ({ id, name }) => {
    return (
        <div className="flex flex-col cursor-pointer p-6 border border-solid border-base-200 justify-center items-center w-full rounded-md shadow-md">
            <p>{name}</p>
            <div className="flex flex-row w-full">
                <Link href={`/account/editAddress/${id}`} passHref>
                    <button type="submit" className="btn">
                        Edit
                    </button>
                </Link>
                <Link href={`/account/deleteAddress/${id}`} passHref>
                    <button type="submit" className="btn">
                        Delete
                    </button>
                </Link>
            </div>
        </div>
    );
};

export default Address;
