import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Movie } from '../../models/movie';
import { MovieService } from '../../services/movie.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
  query = '';
  results: Movie[] = [];
  loading = true;

  constructor(private route: ActivatedRoute, private movieService: MovieService) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.query = params.get('query') || '';
      this.performSearch();
    });
  }
  performSearch(): void {
    this.loading = true;
    this.movieService.getMovies().subscribe({
      next: (movies: Movie[]) => {
        const q = this.query.toLowerCase();
        this.results = movies.filter((movie: Movie) => movie.title.toLowerCase().includes(q));
        this.loading = false;
      },
      error: () => {
        this.results = [];
        this.loading = false;
      }
    });
  }
}