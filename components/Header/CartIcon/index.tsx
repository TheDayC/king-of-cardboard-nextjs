import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { AiOutlineShoppingCart } from 'react-icons/ai';
import Link from 'next/link';
import { useRouter } from 'next/router';

import selector from './selector';

export const CartIcon: React.FC = () => {
    const { itemCount } = useSelector(selector);
    const router = useRouter();

    // Pre-fetch the account page for a better transition.
    useEffect(() => {
        router.prefetch('/cart');
    }, []);

    return (
        <Link href="/cart" passHref>
            <div
                className="flex justify-start items-center indicator cursor-pointer rounded-md hover:bg-neutral-focus relative mr-4 lg:mr-2"
                role="link"
                data-testid="cart"
            >
                <div className="p-2 text-2xl">
                    <AiOutlineShoppingCart />
                </div>
                {itemCount > 0 && <div className="indicator-item badge badge-primary p-1.5 m-1.5">{itemCount}</div>}
            </div>
        </Link>
    );
};

export default CartIcon;
