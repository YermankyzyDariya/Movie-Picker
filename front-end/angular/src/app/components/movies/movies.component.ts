import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-movies',
  templateUrl: './movies.component.html',
  styleUrls: ['./movies.component.css']
})
export class MoviesComponent implements OnInit {

  movies: any[] = [];
  filteredMovies: any[] = [];

  selectedGenres: string[] = [];
  selectedMovies: number[] = [];

  searchTerm: string = '';
  errorMessage: string = '';

  showSimilar: boolean = false;

  selectedMovie: any = null;

  genreMap: { [key: number]: string } = {
    35: 'Action',
    33: 'Drama',
    38: 'Romance',
    36: 'Sci-Fi',
    41: 'Fantasy',
    39: 'Animation',
    43: 'History',
    45: 'Music',
    40: 'Family',
    46: 'Horror',
    42: 'Crime',
    34: 'Comedy',
    37: 'Thriller',
    44: 'Adventure'
  };

  genres: string[] = [
    'Action',
    'Drama',
    'Romance',
    'Sci-Fi',
    'Fantasy',
    'Animation',
    'History',  
    'Music',
    'Family',
    'Horror',
    'Crime',
    'Comedy',
    'Thriller',
    'Adventure'
  ]

  constructor(private http: HttpClient, private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
  this.loadMovies();

  this.router.events
    .pipe(filter(e => e instanceof NavigationEnd))
    .subscribe(() => {
      this.selectedMovie = null;
      this.showSimilar = false;
      this.loadMovies();
    });

  this.route.params.subscribe(params => {
    const genre = params['genre'];

    if (genre) {
      this.filteredMovies = this.movies.filter(movie =>
        movie.genres?.some((g: any) => {
          const name = typeof g === 'string' ? g : g?.name;
          return name?.toLowerCase().includes(genre.toLowerCase());
        })
      );
    } else {
      this.filteredMovies = this.movies;
      }
    });
  }

  filterMovies() {
    this.filteredMovies = this.movies.filter(movie => {
      const matchesSearch = movie.title.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchesGenre = this.selectedGenres.length === 0 || movie.genres?.some((id: number) => 
        this.selectedGenres.includes(this.genreMap[id])
      );
      return matchesSearch && matchesGenre;
      });
  }

  loadMovies() {
    this.http.get<any[]>('http://127.0.0.1:8000/api/movies/')
      .subscribe(data => {
        this.movies = data;
        this.filteredMovies = data;

      this.route.params.subscribe(params => { 
        const genre = params['genre'];

        if (genre) {
          this.filteredMovies = this.movies.filter(movie =>
            movie.genres?.some((id: number) => 
              this.genreMap[id]?.toLowerCase() === genre.toLowerCase()
            )
          );
        } else {
          this.filteredMovies = this.movies;
        }
      });
      });
  }

  goToMovie(id: number) {
    this.router.navigate(['/movie', id]);
  }

  toggleMovie(id: number) {
    this.showSimilar = false;
    if (this.selectedMovies.includes(id)) {
      this.selectedMovies = this.selectedMovies.filter(m => m !== id);
    } else {
      if (this.selectedMovies.length < 2) {
        this.selectedMovies.push(id);
      } else {
        alert('You can select only 2 movies');
      }
    }
  }
  toggleGenre(genre: string) {
    if (this.selectedGenres.includes(genre)) {
      this.selectedGenres = this.selectedGenres.filter(g => g !== genre);
    } else {
      this.selectedGenres.push(genre);
    }
    this.filterMovies();
  } 

  toggleSelection(id: number) {
      if (this.selectedMovies.includes(id)) {
        this.selectedMovies = this.selectedMovies.filter(m => m !== id);
      } else {
      if (this.selectedMovies.length < 2) {
        this.selectedMovies.push(id);
     } else {
        alert('You can select only 2 movies');
        }
      }
    }
  

  goToGenre(genre: string) {
      window.location.href = `/genre/${genre}`;
  }
  openMovie(movie: any) {
    this.selectedMovie = movie;
  }

  closeMovie() {
    this.selectedMovie = null;
  }

  onInput(event: any) {
    this.searchTerm = event.target.value;
  }

  fixImage(url: string): string {
    if (!url) return '';
    if (url.startsWith('http')) return url;
    return `http://127.0.0.1:8000${url}`;
  }

  getGenres(genres: any[]): string {
    if (!genres || genres.length === 0) {
      return 'No genres';
    }
    const names = genres
      .map((g: any) => {
        if (!g) return '';
        if (typeof g === 'string') return g;
        if (g.name) return g.name;
        return '';
      })
      .filter((g: string) => g.trim() !== '');

    return names.length ? names.join(', ') : 'No genres';
  }
  getMovies() {
    const token = localStorage.getItem('token');

    this.http.get<any[]>(
      'http://127.0.0.1:8000/api/movies/',
      {
        headers: {
          Authorization: `Token ${token}`
        }
      }
    ).subscribe({
      next: (data) => {
        console.log('movies', data);
      },
      error: (err) => {
        console.error('Error fetching movies', err);
      }
    });
  }

  findSimilar() {
    const token = localStorage.getItem('token');

    this.http.post<any[]>(
      'http://127.0.0.1:8000/api/similar/',
      {
        movie_ids: this.selectedMovies
      },
      {
        headers: {
          Authorization: `Token ${token}`
        }
      }
    ).subscribe({
      next: (data) => {
        console.log('similar movies', data);
        this.movies = data;
      },
      error: (err) => {
        console.error('error', err);
      }
    });
  }

  onSearch() {
    const token = localStorage.getItem('token');
    this.http.get<any[]>( `http://127.0.0.1:8000/api/movies/search/?q=${this.searchTerm}`,
      {
        headers: {
          Authorization: `Token ${token}`
        }
      }
    ).subscribe({
      next: (data) => {
        console.log('search results', data);
        this.filteredMovies = data;
      },
      error: (err) => {
        console.error('error', err);
      }
    });
  }
}