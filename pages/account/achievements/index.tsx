import React from 'react';
import { GetServerSideProps } from 'next';
import { unstable_getServerSession } from 'next-auth';

import { parseAsString, safelyParse } from '../../../utils/parsers';
import { authOptions } from '../../api/auth/[...nextauth]';
import AccountWrapper from '../../../components/AccountWrapper';
import AchievementList from '../../../components/Account/AchievementList';
import { listAchievements, listObjectives } from '../../../utils/account/achievements';
import { Achievement, Objective } from '../../../types/achievements';

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
    const session = await unstable_getServerSession(req, res, authOptions);

    // If session hasn't been established redirect to the login page.
    if (!session) {
        return {
            redirect: {
                permanent: false,
                destination: '/login',
            },
        };
    }

    const userId = safelyParse(session, 'user.id', parseAsString, '');

    if (!userId) {
        return {
            redirect: {
                permanent: false,
                destination: '/login',
            },
        };
    }

    const achievements = await listAchievements(userId, true);
    const objectives = await listObjectives(userId, true);

    // If we're signed in then decide whether we should show the page or 404.
    return {
        props: {
            achievements,
            objectives,
        },
    };
};

interface OrderHistoryPageProps {
    achievements: Achievement[];
    objectives: Objective[];
}

export const AchievementsPage: React.FC<OrderHistoryPageProps> = ({ achievements, objectives }) => {
    return (
        <AccountWrapper title="Order History - Account - King of Cardboard" description="Your order history">
            <div className="flex flex-col relative w-full py-4 px-6">
                <h1 className="text-5xl">Achievements</h1>
                <AchievementList achievements={achievements} objectives={objectives} />
            </div>
        </AccountWrapper>
    );
};

export default AchievementsPage;
