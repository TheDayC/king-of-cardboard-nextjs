import React, { useState } from 'react';
import Cookies from 'js-cookie';
import { useDispatch, useSelector } from 'react-redux';
import { BiCookie } from 'react-icons/bi';

import { setHasRejected } from '../../store/slices/global';
import selector from './selector';

export const GDPR: React.FC = () => {
    const [cookieConsent, setCookieConsent] = useState(Boolean(Cookies.get('cookieConsent')));
    const dispatch = useDispatch();
    const { hasRejected } = useSelector(selector);

    const handleAcceptCookies = () => {
        Cookies.set('cookieConsent', 'true');
        setCookieConsent(true);
    };

    const handleRejectCookies = () => {
        dispatch(setHasRejected(true));
    };

    if (cookieConsent || hasRejected) return null;

    return (
        <div className="fixed flex flex-col justify-between items-center w-full p-0 bottom-0 left-0 z-20 lg:w-1/4 lg:left-auto lg:right-8 lg:bottom-4">
            <div className="block relative w-full p-4 lg:p-8 bg-green-600 shadow-2xl rounded-md">
                <div className="text-xs text-neutral-content mb-4 md:mr-4 md:text-md md:text-sm">
                    <h4 className="text-xl mb-2">
                        Cookies! <BiCookie className="inline-block text-xl -mt-1" />
                    </h4>
                    <p className="mb-2">
                        This website uses cookies to deliver a high quality service and for analytical purposes.
                    </p>
                    <p className="mb-2">Click accept to consent to cookie use or reject to opt out.</p>
                </div>
                <div className="flex flex-row w-full">
                    <button className="flex-grow btn btn-primary mr-2" onClick={handleAcceptCookies}>
                        Accept
                    </button>
                    <button className="flex-grow btn w-auto ml-2" onClick={handleRejectCookies}>
                        Reject
                    </button>
                </div>
            </div>
        </div>
    );
};

export default GDPR;
