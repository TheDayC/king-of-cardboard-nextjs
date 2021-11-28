import React from 'react';
import { AiOutlineIdcard } from 'react-icons/ai';
import { GiBoxUnpacking, GiAchievement } from 'react-icons/gi';

interface AwardProps {
    icon: string;
}

export const Award: React.FC<AwardProps> = ({ icon }) => {
    switch (icon) {
        case 'break':
            return <GiBoxUnpacking />;
        case 'single':
            return <AiOutlineIdcard />;
        default:
            return <GiAchievement />;
    }
};

export default Award;
