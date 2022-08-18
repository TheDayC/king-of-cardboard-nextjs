import React, { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useSession } from 'next-auth/react';

import selector from './selector';
import { fetchAchievements, fetchObjectives } from '../../../services/achievements';
import { Achievement, Objective as ObjectiveType } from '../../../types/achievements';
import Loading from '../../Loading';
import Objective from './Objective';
import { parseAsString, safelyParse } from '../../../utils/parsers';

export const AchievementList: React.FC = () => {
    const { accessToken } = useSelector(selector);
    const { data: session } = useSession();
    const emailAddress = safelyParse(session, 'user.email', parseAsString, null);
    const [shouldFetchAchievements, setShouldFetchAchievements] = useState(true);
    const [objectives, setObjectives] = useState<ObjectiveType[] | null>(null);
    const [achievements, setAchievements] = useState<Achievement[] | null>(null);

    const getObjectives = useCallback(async (email: string, token: string) => {
        const { objectives } = await fetchObjectives(null, null, 0);
        const { achievements } = await fetchAchievements(email, token);

        setObjectives(objectives);
        setAchievements(achievements);
    }, []);

    // Fetch achievements
    useEffect(() => {
        if (shouldFetchAchievements && accessToken && emailAddress) {
            getObjectives(emailAddress, accessToken);
            setShouldFetchAchievements(false);
        }
    }, [accessToken, shouldFetchAchievements, getObjectives, emailAddress]);

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
