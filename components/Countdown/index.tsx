import React, { useCallback, useEffect, useState } from 'react';
import { ceil, round } from 'lodash';
import Image from 'next/image';
import Link from 'next/link';
import { useSelector } from 'react-redux';
import { DateTime, Interval } from 'luxon';

import { ImageItem } from '../../../../types/products';
import selector from './selector';
import { getSkus } from '../../../../utils/commerce';

interface BreakProps {
    breakDate: DateTime;
}

export const Countdown: React.FC<BreakProps> = ({ breakDate }) => {
    const [currentDate, setCurrentDate] = useState(DateTime.now().setZone('Europe/London'));
    const duration = currentDate.until(breakDate).toDuration(['days', 'hours', 'minutes', 'seconds']).toObject();

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentDate(DateTime.now().setZone('Europe/London'));
        }, 1000);

        return () => {
            clearInterval(interval);
        };
    });

    const daysStyle = { '--value': duration.days } as React.CSSProperties;
    const hoursStyle = { '--value': duration.hours } as React.CSSProperties;
    const minutesStyle = { '--value': duration.minutes } as React.CSSProperties;
    const secondsStyle = { '--value': round(duration.seconds || 0) } as React.CSSProperties;

    return (
        <div className="grid grid-flow-col gap-1 text-center auto-cols-max">
            <div className="flex flex-col p-2 pl-0 text-sm">
                <span className="font-mono countdown justify-center items-center">
                    <span style={daysStyle}></span>
                </span>
                days
            </div>
            <div className="flex flex-col p-2 text-sm">
                <span className="font-mono countdown justify-center items-center">
                    <span style={hoursStyle}></span>
                </span>
                hours
            </div>
            <div className="flex flex-col p-2 text-sm">
                <span className="font-mono countdown justify-center items-center">
                    <span style={minutesStyle}></span>
                </span>
                min
            </div>
            <div className="flex flex-col p-2 text-sm">
                <span className="font-mono countdown justify-center items-center">
                    <span style={secondsStyle}></span>
                </span>
                sec
            </div>
        </div>
    );
};

export default Countdown;
