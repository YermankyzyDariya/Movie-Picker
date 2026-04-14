import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Movie } from '../../models/movie';

@Component({
  selector: 'app-movie-list',
  templateUrl: './movie-list.component.html',
  styleUrls: ['./movie-list.component.scss']
})
export class MovieListComponent {
  @Input() movies: Movie[] = [];

  constructor(private router: Router) {}

  openMovie(movie: Movie): void {
    this.router.navigate(['/movie', movie.id]);
  }
}