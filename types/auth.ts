import { Session } from 'next-auth';

export interface SessionReturn {
    data: Session | null;
    status: string;
}

export interface UserSession {
    token: string | null;
    id: string | null;
}
