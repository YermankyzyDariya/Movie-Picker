import { Component, OnInit } from '@angular/core';
import { WatchlistService } from '../../services/watchlist.service';
import { Watchlist } from '../../models/watchlist';

@Component({
  selector: 'app-watchlist',
  templateUrl: './watchlist.component.html'
})
export class WatchlistComponent implements OnInit {
  items: Watchlist[] = [];
  movieId = 0;

  constructor(private service: WatchlistService) {}

  ngOnInit(): void {
    this.load();
  }

  load() {
    this.service.getWatchlist().subscribe(data => this.items = data);
  }

  add() {
    this.service.addToWatchlist(this.movieId).subscribe(() => this.load());
  }

  remove(id: number) {
    this.service.removeFromWatchlist(id).subscribe(() => this.load());
  }

  onMovieIdChange(event: Event) {
    this.movieId = Number((event.target as HTMLInputElement).value);
  }
}