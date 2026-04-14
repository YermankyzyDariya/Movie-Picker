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

  private token = '596d07a1dc9a9e62c8d4ac66bbb1cee0801468f9';

  private headers = new HttpHeaders({
    Authorization: `Token ${this.token}`
  });

  constructor(private http: HttpClient) {}

  getMovies() {
  return this.http.get<any[]>('http://127.0.0.1:8000/api/movies/', {
    headers: {
      Authorization: `Token ${this.token}`
    }
  });
}
  getMovie(id: number): Observable<Movie> {
    return this.http.get<Movie>(`${this.baseUrl}${id}/`, { headers: new HttpHeaders({
      Authorization: `Token ${this.token}`
    }) });
  }
}