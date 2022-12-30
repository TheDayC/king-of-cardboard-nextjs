import { round } from 'lodash';
import React from 'react';
import { MdOutlineCelebration } from 'react-icons/md';
import { RiAwardFill } from 'react-icons/ri';
import { BiCoinStack } from 'react-icons/bi';
import { AiFillFire } from 'react-icons/ai';

import { ObjectId } from '../../../../types/achievements';
import { nextMilestone, progressColour } from '../../../../utils/achievements';
import Progress from '../../../Progress';
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
    // id,
    name,
    // category,
    // min,
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
    const percentage = round((current / max) * 100);

    return (
        <div className="flex flex-col w-full justify-center items-center p-0 mb-4 md:p-2 md:mb-0 lg:mb-0 lg:p-4">
            <div className={`text-4xl mb-2 text-${progressClass}`}>
                <Award icon={icon} />
            </div>
            <h3 className="text-xl mb-2">{name}</h3>
            <div className="flex flex-col justify-start items-start w-full">
                <div className="text-lg text-base-200">
                    <p className="mb-1">
                        {hasHitMilestone ? (
                            <React.Fragment>
                                <MdOutlineCelebration className="mr-2 inline text-accent" />
                                <span className="text-accent">Milestone {next} hit!</span>
                            </React.Fragment>
                        ) : (
                            <React.Fragment>
                                <RiAwardFill className="inline-block mr-1 text-md -mt-0.5 text-accent" />
                                Next milestone: {next}
                            </React.Fragment>
                        )}
                    </p>
                    <p className="mb-1">
                        <BiCoinStack className="inline-block mr-1 -mt-0.5 text-primary" />
                        Reward: {reward}
                    </p>
                    <p className="mb-1">
                        <AiFillFire className="inline-block mr-1 -mt-0.5 text-yellow-600" />
                        Multiplier: x{milestoneMultiplier}
                    </p>
                </div>
                <Progress complete={percentage} colour={progressClass} current={current} max={max} />
            </div>
        </div>
    );
};

export default Objective;
