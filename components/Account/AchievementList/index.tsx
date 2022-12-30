import React from 'react';

import { Achievement, Objective as ObjectiveType } from '../../../types/achievements';
import Objective from './Objective';

interface AchievementListProps {
    objectives: ObjectiveType[];
    achievements: Achievement[];
}

export const AchievementList: React.FC<AchievementListProps> = ({ objectives, achievements }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 relative">
            {objectives.map((obj) => {
                const { _id, name, category, min, max, milestone, milestoneMultiplier, reward } = obj;
                const matchingAchievement = achievements ? achievements.find((a) => a.id === obj._id) : null;
                const current = matchingAchievement ? matchingAchievement.current : 0;

                return (
                    <Objective
                        id={_id}
                        name={name}
                        category={category}
                        min={min}
                        max={max}
                        milestone={milestone}
                        milestoneMultiplier={milestoneMultiplier}
                        reward={reward}
                        current={current}
                        icon={obj.icon}
                        key={`objective-${_id}`}
                    />
                );
            })}
        </div>
    );
};

export default AchievementList;
