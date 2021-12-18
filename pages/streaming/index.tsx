import React from 'react';
import ReactTwitchEmbedVideo from 'react-twitch-embed-video';

import Header from '../../components/Header';

export const StreamingPage: React.FC = () => {
    return (
        <React.Fragment>
            <Header />
            <div className="container mx-auto p-8">
                <ReactTwitchEmbedVideo channel="dayc" theme="dark" width={1280} />
            </div>
        </React.Fragment>
    );
};

export default StreamingPage;
