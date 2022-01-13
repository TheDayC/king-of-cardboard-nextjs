export interface Team {
    code: string;
    name: string;
    amount: string;
    image_id: string;
    image_url: string;
}

export interface Teams {
    [team: string]: Team;
}
