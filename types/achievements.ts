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
}

export interface Achievement {
    id: ObjectId;
    current: number;
}
