import { Session } from 'next-auth';

class Achievements {
    readonly _session: Session | null = null;

    constructor(session: Session) {
        this._session = session;
    }

    get session(): Session | null {
        return this._session;
    }
}

export default Achievements;
