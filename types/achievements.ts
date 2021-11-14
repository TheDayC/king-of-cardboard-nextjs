interface ObjectId {
    $oid: string;
}

export interface Objective {
    _id: ObjectId;
    name: string;
    min: number;
    max: number;
    rewardIncrement: number;
    category: string;
}
