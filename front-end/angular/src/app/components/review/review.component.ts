import { Component, OnInit } from '@angular/core';
import { ReviewService } from '../../services/review.service';
import { Review } from '../../models/review';

@Component({
  selector: 'app-review',
  templateUrl: './review.component.html'
})
export class ReviewComponent implements OnInit {
  reviews: Review[] = [];

  movieId = 0;
  rating = 5;
  comment = '';

  constructor(private service: ReviewService) {}

  ngOnInit(): void {
    this.load();
  }

  load() {
    this.service.getReviews().subscribe(data => this.reviews = data);
  }

  add() {
    this.service.createReview({
      movie: this.movieId,
      rating: this.rating,
      comment: this.comment
    }).subscribe(() => {
      this.comment = '';
      this.load();
    });
  }
  
  onMovieIdChange(event: Event) {
    this.movieId = Number((event.target as HTMLInputElement).value);
  }
  onRatingChange(event: Event) {
    this.rating = Number((event.target as HTMLInputElement).value);
  }
  onCommentChange(event: Event) {
    this.comment = (event.target as HTMLInputElement).value;
  }
}