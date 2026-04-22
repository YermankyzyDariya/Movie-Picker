import { Movie } from './movie';
export interface Review {
    id: number;
    user: number | string;
    movie: Movie | number;
    rating: number;
    comment: string;
    created_at: string;
}