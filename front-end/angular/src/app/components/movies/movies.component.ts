import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

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

  genreList: string[] = [
    'Action','Drama','Romance','Sci-Fi','Fantasy',
    'Animation','History','Music','Family','Horror',
    'Crime','Comedy','Thriller','Adventure'
  ];

  selectedMovie: any = null;

  genreMap: { [key: number]: string } = {
    28: 'Action',
    18: 'Drama',
    10749: 'Romance',
    878: 'Sci-Fi',
    14: 'Fantasy',
    16: 'Animation',
    36: 'History',
    10402: 'Music',
    10751: 'Family',
    27: 'Horror',
    80: 'Crime',
    35: 'Comedy',
    53: 'Thriller',
    12: 'Adventure'
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
      this.resetFilters();
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
    }
  });
}

  loadMovies() {
    this.http.get<any[]>('http://127.0.0.1:8000/api/movies/')
      .subscribe(data => {
        this.movies = data;
        this.filteredMovies = data;
      });
  }

  resetFilters() {
    this.selectedGenres = [];
    this.selectedMovies = [];
    this.searchTerm = '';
  }

  toggleGenre(genre: string) {
    if (this.selectedGenres.includes(genre)) {
      this.selectedGenres = this.selectedGenres.filter(g => g !== genre);
    } else {
      this.selectedGenres.push(genre);
    }
    this.applyFilters();
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

  openMovie(movie: any) {
    this.selectedMovie = movie;
  }

  closeMovie() {
    this.selectedMovie = null;
  }

  applyFilters() {
  this.filteredMovies = this.movies.filter(movie => {

    const matchesSearch =
      movie.title.toLowerCase().includes(this.searchTerm.toLowerCase());

    const matchesGenre =
      this.selectedGenres.length === 0 ||
      movie.genres?.some((g: any) => {
        const name = typeof g === 'string' ? g : g?.name;
        return this.selectedGenres.includes(name);
      });

    return matchesSearch && matchesGenre;
  });
}

  onSearch() {
    this.showSimilar = false;
    this.applyFilters();
  }

  findSimilar() {
  if (this.selectedMovies.length !== 2) {
    alert('Select exactly 2 movies');
    return;
  }

  this.showSimilar = true;

  this.http.post<any[]>(
    'http://127.0.0.1:8000/api/movies/similar/',
    { movies: this.selectedMovies }
  ).subscribe({
    next: (data) => {
      this.filteredMovies = data;
    },
    error: () => {
      this.errorMessage = 'Failed to load similar movies';
    }
  });
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
}