import React from 'react';
import Cookies from 'js-cookie';
import { useDispatch, useSelector } from 'react-redux';
import { BiCookie } from 'react-icons/bi';

import { setHasRejected } from '../../store/slices/global';
import selector from './selector';

export const GDPR: React.FC = () => {
    const cookieConsent = Boolean(Cookies.get('cookieConsent'));
    const dispatch = useDispatch();
    const { hasRejected } = useSelector(selector);

    const handleAcceptCookies = () => {
        Cookies.set('cookieConsent', 'true');
    };

    const handleRejectCookies = () => {
        dispatch(setHasRejected(true));
    };

    if (cookieConsent || hasRejected) return null;

    return (
        <div className="fixed flex flex-col justify-between items-center w-full p-0 bottom-0 left-0 z-20 lg:w-1/4 lg:left-auto lg:right-8 lg:bottom-4">
            <div className="block relative w-full p-8 bg-green-600 shadow-2xl rounded-md">
                <div className="text-xs text-neutral-content mb-4 md:mr-4 md:text-md md:text-sm">
                    <h4 className="text-xl mb-4">
                        Cookies! <BiCookie className="inline-block text-xl -mt-1" />
                    </h4>
                    <p>
                        This website uses cookies to deliver a high quality service and for analytical purposes. You
                        will still be able to purchase products but our more advanced features require cookies to use.
                        If you wish to use these features confirm your consent to the use of cookies using the accept
                        cookies button.
                    </p>
                </div>
                <div className="flex flex-col w-full">
                    <button className="btn btn-block btn-primary mb-4" onClick={handleAcceptCookies}>
                        Accept Cookies
                    </button>
                    <button className="btn btn-block" onClick={handleRejectCookies}>
                        Reject Cookies
                    </button>
                </div>
            </div>
        </div>
    );
};

export default GDPR;
