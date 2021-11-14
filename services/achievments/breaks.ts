/* import axios from 'axios';
import { Session } from 'next-auth';

import Achievements from '.';
import { Objective } from '../../types/achievements';
import { parseAsArrayOfObjectives, safelyParse } from '../../utils/parsers';

class Breaks extends Achievements {
    private _achievementIds: string[] | null = null;

    constructor(session: Session, accessToken: string) {
        super(session, accessToken);
    }

    get achievementIds(): string[] | null {
        return this._achievementIds;
    }

    set achievementIds(ids: string[] | null) {
        this._achievementIds = ids;
    }

    public async fetchObjectives(category: string): Promise<Objective[] | null> {
        const response = await axios.post('/api/achievements/getObjectives', {category});

        if (response) {
            return safelyParse(response, 'data.objectives', parseAsArrayOfObjectives, null);
        }

        return null;
    }
}

export default Breaks;
 */
