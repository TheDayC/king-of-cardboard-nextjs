import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useSession } from 'next-auth/react';

import selector from './selector';
import Achievements from '../../../services/achievments';
import { Achievement, Objective as ObjectiveType } from '../../../types/achievements';
import Loading from '../../Loading';
import Objective from './Objective';

export const AchievementList: React.FC = () => {
    const { accessToken } = useSelector(selector);
    const { data: session } = useSession();
    const [shouldFetchAchievements, setShouldFetchAchievements] = useState(true);
    const [objectives, setObjectives] = useState<ObjectiveType[] | null>(null);
    const [achievements, setAchievements] = useState<Achievement[] | null>(null);
    const [page, setPage] = useState(0);
    const [count, setCount] = useState(0);

    const fetchObjectives = async (service: Achievements) => {
        const hasFetchedObjectives = await service.fetchObjectives(null, null, page);

        if (hasFetchedObjectives) {
            setObjectives(service.objectives);
            setCount(service.objectivesCount);
        }

        if (service.achievements) {
            setAchievements(service.achievements);
        }
    };

    // Fetch achievements
    useEffect(() => {
        if (shouldFetchAchievements && accessToken && session) {
            const achievementService = new Achievements(session, accessToken);

            fetchObjectives(achievementService);
            setShouldFetchAchievements(false);
        }
    }, [accessToken, session, shouldFetchAchievements]);

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 relative">
            <Loading show={!objectives} />
            {objectives &&
                objectives.map((obj) => {
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
