import React, { useState } from 'react';

import { BreakTabs } from '../../enums/breaks';
import Grid from './Grid';
import InstagramMessage from './InstagramMessage';

const baseClassName = 'tab tab-bordered w-1/2';

export const Breaks: React.FC = () => {
    const [currentTab, setCurrentTab] = useState(BreakTabs.Live);
    const isLiveTab = currentTab === BreakTabs.Live;
    const isArchiveTab = currentTab === BreakTabs.Archive;
    const liveClassName = `${baseClassName}${isLiveTab ? ' tab-active' : ''}`;
    const archiveClassName = `${baseClassName}${isArchiveTab ? ' tab-active' : ''}`;

    const handleLiveTabClick = () => {
        setCurrentTab(BreakTabs.Live);
    };

    const handleArchiveTabClick = () => {
        setCurrentTab(BreakTabs.Archive);
    };

    return (
        <div className="block relative w-full">
            <div className="tabs flex-row w-full justify-start items-center mb-6">
                <a className={liveClassName} onClick={handleLiveTabClick}>
                    Live Breaks
                </a>
                <a className={archiveClassName} onClick={handleArchiveTabClick}>
                    Archive
                </a>
            </div>
            {isLiveTab && <InstagramMessage />}
            {isArchiveTab && <Grid />}
        </div>
    );
};

export default Breaks;
