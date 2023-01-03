import React from 'react';

const colors: Record<string, string> = {
    yellow: 'rgb(250, 204, 21)',
    green: 'rgb(74, 222, 128)',
    red: 'rgb(248, 113, 113)',
};

interface BadgeProps {
    color: string;
}

export const Badge: React.FC<BadgeProps> = ({ color }) => {
    return (
        <span
            className="badge badge-xs indicator-item w-5 h-5 border-none shadow-sm shadow-slate-500"
            style={{ backgroundColor: colors[color] }}
        ></span>
    );
};

export default Badge;
