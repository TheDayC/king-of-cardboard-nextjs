import React, { useEffect, useMemo, useState } from 'react';
import { round, get } from 'lodash';
import { DateTime } from 'luxon';

interface BreakProps {
    breakDate: DateTime;
}

export const Countdown: React.FC<BreakProps> = ({ breakDate }) => {
    const [currentDate, setCurrentDate] = useState(DateTime.now().setZone('Europe/London'));
    const duration = currentDate.until(breakDate).toDuration(['days', 'hours', 'minutes', 'seconds']).toObject();
    const days = get(duration, 'days', 0);
    const hours = get(duration, 'hours', 0);
    const minutes = get(duration, 'minutes', 0);
    const seconds = get(duration, 'seconds', 0);
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
    }, []);

    // If the duration has passed then clear the interval.
    useEffect(() => {
        if (hasPassed) {
            clearInterval(interval);
        }
    }, [hasPassed]);

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
