export interface Objective {
    _id: string;
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
    id: string;
    current: number;
}

export interface CategoriesAndTypes {
    categories: string[];
    types: string[];
}

export interface RecalculateAchievements {
    achievements: Achievement[];
    points: number;
}
