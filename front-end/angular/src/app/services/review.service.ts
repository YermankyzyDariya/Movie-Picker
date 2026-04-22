import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Review } from '../models/review';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ReviewService {
  private api = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getReviews(): Observable<Review[]> {
    return this.http.get<Review[]>(`${this.api}reviews/`);
  }

  createReview(payload: { movie: number; rating: number; comment: string }): Observable<Review> {
    return this.http.post<Review>(`${this.api}reviews/`, payload);
  }
}