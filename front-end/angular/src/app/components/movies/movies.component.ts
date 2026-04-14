import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { environment } from '../../../environments/environment';
import { MovieService } from '../../services/movie.service';
import { Movie } from '../../models/movie';

@Component({
  selector: 'app-movies',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './movies.component.html',
  styleUrls: ['./movies.component.css']
})
export class MoviesComponent implements OnInit {
  environment = environment;
  movies: any[] = [];
  filteredMovies: any[] = [];

  currentGenre: string | null = null;
  displayGenre = '';
  searchTerm = '';

  genreMap: Record<string, string> = {
    'Action': 'Action',
    'Drama': 'Drama',
    'Romance': 'Romance',
    'Sci-Fi': 'Sci-Fi',
    'Fantasy': 'Fantasy',
    'Animation': 'Animation'
  };

  constructor(
    private movieService: MovieService,
    private route: ActivatedRoute
  ) {}

  getImage(title: string): string {
    const images: any = {
      'Inception': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS1ylQxJCDkRmlhPcTzBMXenct8rScWPHqvPA&s',
      'The Dark Knight': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSnhQoFxFYsLZx2r9Vh2F8E63WGrgp9ylg1Tg&s',
      'Interstellar': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTyACqs1ijAltZyjD1rgenu17O1Im2XXaHI-A&s',
      'The Matrix': 'https://upload.wikimedia.org/wikipedia/en/d/db/The_Matrix.png',
      'Barbie': 'https://upload.wikimedia.org/wikipedia/en/0/0b/Barbie_2023_poster.jpg',
      'Titanic': 'https://upload.wikimedia.org/wikipedia/en/thumb/1/18/Titanic_%281997_film%29_poster.png/250px-Titanic_%281997_film%29_poster.png',
      'Avatar': 'https://upload.wikimedia.org/wikipedia/en/d/d6/Avatar_%282009_film%29_poster.jpg',
      'Joker': 'https://upload.wikimedia.org/wikipedia/en/thumb/e/e1/Joker_%282019_film%29_poster.jpg/250px-Joker_%282019_film%29_poster.jpg',
      'Avengers: Endgame': 'https://m.media-amazon.com/images/M/MV5BMTc5MDE2ODcwNV5BMl5BanBnXkFtZTgwMzI2NzQ2NzM@._V1_.jpg',
      'Spider-Man: No Way Home': 'https://upload.wikimedia.org/wikipedia/en/thumb/7/70/Spider-Man_No_Way_Home_%E2%80%93_The_More_Fun_Stuff_Version_poster.jpeg/250px-Spider-Man_No_Way_Home_%E2%80%93_The_More_Fun_Stuff_Version_poster.jpeg',
      'Frozen': 'https://upload.wikimedia.org/wikipedia/en/0/05/Frozen_%282013_film%29_poster.jpg',
      'Toy Story': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR6zsEdlqZq9A2VOZLNot0aqWTUp0bV_9fDKA&s',
      'Gladiator': 'https://upload.wikimedia.org/wikipedia/en/f/fb/Gladiator_%282000_film_poster%29.png',
      'The Lion King': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQpki8anPADUFysSoFl7XAzU4jXRwJp5--oyA&s',
      "Harry Potter and the Sorcerer’s Stone": 'https://m.media-amazon.com/images/M/MV5BNTU1MzgyMDMtMzBlZS00YzczLThmYWEtMjU3YmFlOWEyMjE1XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg',      
      'Fight Club': 'https://m.media-amazon.com/images/M/MV5BOTgyOGQ1NDItNGU3Ny00MjU3LTg2YWEtNmEyYjBiMjI1Y2M5XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg',
      'Forrest Gump': 'https://m.media-amazon.com/images/M/MV5BNDYwNzVjMTItZmU5YS00YjQ5LTljYjgtMjY2NDVmYWMyNWFmXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg',
      'The Shawshank Redemption': 'https://m.media-amazon.com/images/M/MV5BMDAyY2FhYjctNDc5OS00MDNlLThiMGUtY2UxYWVkNGY2ZjljXkEyXkFqcGc@._V1_.jpg',
      'Doctor Strange': 'https://upload.wikimedia.org/wikipedia/en/1/17/Doctor_Strange_in_the_Multiverse_of_Madness_poster.jpg',
      'Black Panther': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRxkAp-UQJV3AeqakST2qqQGTyIRJs98CHLwQ&s',
      'Inside Out': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQtK27vA-xp0JMWtkGjbX7TgYmKh6zrLtFGag&s',
    }
    return images[title] || 'https://via.placeholder.com/200x300';
  }

  ngOnInit(): void {
    this.movieService.getMovies().subscribe({
      next: (data) => {
        console.log(data);
        this.movies = (data as any[]).map((movie: any) => ({
          ...movie,
          image: this.getImage(movie.title)
        }));

        this.route.paramMap.subscribe(params => {
          this.currentGenre = params.get('genre');
          this.displayGenre = this.currentGenre
            ? (this.genreMap[this.currentGenre] || this.currentGenre)
            : 'Movies';

          this.applyFilters();
        });
      },
      error: (err) => {
        console.log('Ошибка загрузки:', err);
      }
    });
  }

  onSearch(): void {
    this.applyFilters();
  }

  private applyFilters(): void {
    let result = [...this.movies];

    if (this.currentGenre) {
      result = result.filter(movie => movie.genre === this.currentGenre);
    }
    const term = this.searchTerm.trim().toLowerCase();
    if (term) {
      result = result.filter(movie =>
        movie.title.toLowerCase().includes(term)
      );
    }
    this.filteredMovies = result;
  }
}