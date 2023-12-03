import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { BsCart3 } from 'react-icons/bs';

import selector from './selector';

export const CartIcon: React.FC = () => {
    const { itemCount } = useSelector(selector);
    const router = useRouter();

    // Pre-fetch the account page for a better transition.
    useEffect(() => {
        router.prefetch('/cart');
    }, [router]);

    return (
        <Link href="/cart" passHref>
            <div
                className="flex justify-start items-center indicator cursor-pointer rounded-md relative lg:mr-2 menu-link"
                role="link"
                data-testid="cart"
            >
                <div className="p-2 text-2xl">
                    <BsCart3 />
                </div>
                {itemCount > 0 && <div className="indicator-item badge badge-primary p-1.5 m-1.5">{itemCount}</div>}
            </div>
        </Link>
    );
};

export default CartIcon;
