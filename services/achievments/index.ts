import axios from 'axios';
import { Session } from 'next-auth';

import { Objective } from '../../types/achievements';
import { parseAsArrayOfObjectives, parseAsString, safelyParse } from '../../utils/parsers';

class Achievements {
    readonly _email: string | null = null;
    readonly _accessToken: string | null = null;
    private _achievementIds: string[] | null = null;

    constructor(session: Session, accessToken: string) {
        this._email = safelyParse(session, 'user.email', parseAsString, null);
        this._accessToken = accessToken;
    }

    public async fetchObjectives(category: string): Promise<Objective[] | null> {
        const response = await axios.post('/api/achievements/getObjectives', { category });

        if (response) {
            return safelyParse(response, 'data.objectives', parseAsArrayOfObjectives, null);
        }

        return null;
    }
}

export default Achievements;
