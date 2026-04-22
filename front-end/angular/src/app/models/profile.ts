export interface Profile {
    id: number;
    user: number | string;
    bio: string;
    avatar?: string;
    favorite_genre: string;
    created_at: string;
}