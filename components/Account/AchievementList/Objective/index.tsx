import React from 'react';
import { MdOutlineCelebration } from 'react-icons/md';

import { ObjectId } from '../../../../types/achievements';
import { nextMilestone, progressColour } from '../../../../utils/achievements';
import Award from '../../Award';

interface ObjectiveProps {
    id: ObjectId;
    name: string;
    category: string;
    min: number;
    max: number;
    milestone: number;
    milestoneMultiplier: number;
    reward: number;
    current: number;
    icon: string;
}

export const Objective: React.FC<ObjectiveProps> = ({
    id,
    name,
    category,
    min,
    max,
    milestone,
    milestoneMultiplier,
    reward,
    current,
    icon,
}) => {
    const progressClass = progressColour(max, current);
    const next = nextMilestone(milestone, max, current);
    const hasHitMilestone = next === current;

    return (
        <div className="flex flex-col w-full justify-center items-center">
            <div className={`text-4xl mb-2 text-${progressClass}`}>
                <Award icon={icon} />
            </div>
            <h3 className="text-xl">{name}</h3>
            <div className="flex flex-col justify-center items-center p-6 space-y-4 w-full">
                <p className="text-md">
                    Progress: {current}/{max}
                </p>
                {hasHitMilestone && (
                    <div className="flex flex-col justify-center items-center">
                        <div className="flex flex-row text-sm text-accent justify-center items-center">
                            <p className="text-sm text-accent">Milestone {next} hit!</p>
                            <MdOutlineCelebration className="text-lg ml-2" />
                        </div>
                    </div>
                )}
                {!hasHitMilestone && <p className="text-sm text-base-200">Next Milestone: {next}</p>}
                <progress className={`progress progress-${progressClass} h-4`} value={current} max={max}></progress>
            </div>
        </div>
    );
};

export default Objective;
