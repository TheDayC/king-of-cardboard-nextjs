import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useSession } from 'next-auth/react';

import selector from './selector';
import Achievements from '../../../services/achievments';
import { Achievement, Objective } from '../../../types/achievements';

export const AchievementList: React.FC = () => {
    const { accessToken } = useSelector(selector);
    const { data: session } = useSession();
    const [shouldFetchAchievements, setShouldFetchAchievements] = useState(true);
    const [objectives, setObjectives] = useState<Objective[] | null>(null);
    console.log('🚀 ~ file: index.tsx ~ line 14 ~ objectives', objectives);
    const [achievements, setAchievements] = useState<Achievement[] | null>(null);
    const [page, setPage] = useState(0);
    const [count, setCount] = useState(0);

    const fetchObjectives = async (service: Achievements) => {
        const hasFetchedObjectives = await service.fetchObjectives(null, null, page);

        if (hasFetchedObjectives) {
            setObjectives(service.objectives);
            setCount(service.objectivesCount);
        }
    };

    // Fetch achievements
    useEffect(() => {
        if (shouldFetchAchievements && accessToken && session) {
            const achievementService = new Achievements(session, accessToken);

            fetchObjectives(achievementService);
            setAchievements(achievementService.achievements);
            setShouldFetchAchievements(false);
        }
    }, [accessToken, session, shouldFetchAchievements]);

    return <h1>Achievements</h1>;
};

export default AchievementList;
