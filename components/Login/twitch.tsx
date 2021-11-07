import React from 'react';
import { signIn } from 'next-auth/react';
import { BsTwitch } from 'react-icons/bs';

export const Twitch: React.FC = () => {
    const handleTwitchLogin = () => {
        signIn('twitch');
    };

    return (
        <button
            type="submit"
            className={`btn btn-block bg-twitch rounded-md shadow-md mt-2 hover:bg-twitch-dark`}
            onClick={handleTwitchLogin}
        >
            <BsTwitch className="inline-block w-6 h-6 mr-2" />
            Twitch
        </button>
    );
};

export default Twitch;
