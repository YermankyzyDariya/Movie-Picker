import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Watchlist } from '../models/watchlist';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class WatchlistService {
  private api = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getWatchlist(): Observable<Watchlist[]> {
    return this.http.get<Watchlist[]>(`${this.api}watchlist/`);
  }

  addToWatchlist(movieId: number): Observable<Watchlist> {
    return this.http.post<Watchlist>(`${this.api}watchlist/`, { movie: movieId });
  }

  removeFromWatchlist(id: number) {
    return this.http.delete(`${this.api}watchlist/${id}/`);
  }
}