import React from 'react';
import { signIn } from 'next-auth/react';
import { FcGoogle } from 'react-icons/fc';

export const Google: React.FC = () => {
    const handleGoogleLogin = () => {
        signIn('google');
    };

    return (
        <button
            type="submit"
            className={`btn btn-block btn-ghost rounded-md text-base-content shadow-md`}
            onClick={handleGoogleLogin}
        >
            <FcGoogle className="inline-block w-6 h-6 mr-2" />
            Google
        </button>
    );
};

export default Google;
