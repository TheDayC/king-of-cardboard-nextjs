import { Session } from 'next-auth';

export interface SessionReturn {
    data: Session | null;
    status: string;
}
