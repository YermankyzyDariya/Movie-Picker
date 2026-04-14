export interface Movie {
  id: number;
  title: string;
  description: string;
  genre: string;
  category: string;
  rating?: number;
  imageUrl?: string;
  image?: string;
  [key: string]: any;
}