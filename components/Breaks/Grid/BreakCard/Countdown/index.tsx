import React, { useEffect, useMemo, useState } from 'react';
import { round } from 'lodash';
import { DateTime } from 'luxon';

import { parseAsNumber, safelyParse } from '../../../../../utils/parsers';

interface BreakProps {
    breakDate: DateTime;
}

export const Countdown: React.FC<BreakProps> = ({ breakDate }) => {
    const [currentDate, setCurrentDate] = useState(DateTime.now().setZone('Europe/London'));
    const duration = currentDate.until(breakDate).toDuration(['days', 'hours', 'minutes', 'seconds']).toObject();
    const days = safelyParse(duration, 'days', parseAsNumber, 0);
    const hours = safelyParse(duration, 'hours', parseAsNumber, 0);
    const minutes = safelyParse(duration, 'minutes', parseAsNumber, 0);
    const seconds = safelyParse(duration, 'seconds', parseAsNumber, 0);
    const hasPassed = days <= 0 && hours <= 0 && minutes <= 0 && round(seconds) <= 0;

    // Set an interval once.
    const interval = useMemo(() => {
        return setInterval(() => {
            setCurrentDate(DateTime.now().setZone('Europe/London'));
        }, 1000);
    }, []);

    // If the component unloads then clear the interval.
    useEffect(() => {
        return () => {
            clearInterval(interval);
        };
    }, [interval]);

    // If the duration has passed then clear the interval.
    useEffect(() => {
        if (hasPassed) {
            clearInterval(interval);
        }
    }, [hasPassed, interval]);

    if (hasPassed) {
        return null;
    }

    // Set inline styling attributes for the countdown.
    const daysStyle = { '--value': days } as React.CSSProperties;
    const hoursStyle = { '--value': hours } as React.CSSProperties;
    const minutesStyle = { '--value': minutes } as React.CSSProperties;
    const secondsStyle = { '--value': round(seconds) } as React.CSSProperties;

    return (
        <div className="grid grid-flow-col gap-1 text-center auto-cols-max">
            <div className="flex flex-col px-2 pl-0 text-sm">
                <span className="font-mono countdown justify-center items-center">
                    <span style={daysStyle}></span>
                </span>
                days
            </div>
            <div className="flex flex-col px-2 text-sm">
                <span className="font-mono countdown justify-center items-center">
                    <span style={hoursStyle}></span>
                </span>
                hours
            </div>
            <div className="flex flex-col px-2 text-sm">
                <span className="font-mono countdown justify-center items-center">
                    <span style={minutesStyle}></span>
                </span>
                min
            </div>
            <div className="flex flex-col px-2 text-sm">
                <span className="font-mono countdown justify-center items-center">
                    <span style={secondsStyle}></span>
                </span>
                sec
            </div>
        </div>
    );
};

export default Countdown;
