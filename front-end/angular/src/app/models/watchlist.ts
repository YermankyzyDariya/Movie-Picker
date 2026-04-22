import { Movie } from './movie';
export interface Watchlist {
    id: number;
    user: number | string;
    movie: Movie | number;
    added_at: string;
}