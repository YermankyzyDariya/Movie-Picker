import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MovieService } from '../../services/movie.service';
import { Movie } from '../../models/movie';

@Component({
  selector: 'app-movie-detail',
  templateUrl: './movie-detail.component.html',
  styleUrls: ['./movie-detail.component.scss']
})
export class MovieDetailComponent implements OnInit {
  movie: Movie | null = null;
  loading = true;
  error: string | null = null;

  constructor(private route: ActivatedRoute, private movieService: MovieService) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    const id = Number(idParam);

    if (!idParam) {
      this.error = 'Фильм не найден';
      this.loading = false;
      return;
    }
    this.movieService.getMovie(id).subscribe({
      next: movie => {
        this.movie = movie;
        this.loading = false;
      },
      error: () => {
        this.error = 'Не удалось загрузить фильм';
        this.loading = false;
      }
    });
  }
}