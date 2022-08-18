export interface ObjectId {
    $oid: string;
}

export interface Objective {
    _id: ObjectId;
    name: string;
    min: number;
    max: number;
    reward: number;
    milestone: number;
    milestoneMultiplier: number;
    category: string;
    icon: string;
}

export interface Achievement {
    id: ObjectId;
    current: number;
}

export interface FetchAchievements {
    giftCardId: string | null;
    achievements: Achievement[] | null;
}

export interface FetchObjectives {
    objectives: Objective[];
    count: number;
}

export interface CategoriesAndTypes {
    categories: string[];
    types: string[];
}

export interface RecalculateAchievements {
    achievements: Achievement[];
    points: number;
}
