import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Movie } from '../models/movie';

@Injectable({
  providedIn: 'root'
})
export class MovieService {
  private readonly baseUrl = `${environment.apiUrl}movies/`;

  constructor(private http: HttpClient) {}

  getMovies(): Observable<Movie[]> {
    return this.http.get<Movie[]>(
      this.baseUrl);
    }
  getMovie(id: number): Observable<Movie> {
    return this.http.get<Movie>(`${this.baseUrl}${id}/`);
  }
}