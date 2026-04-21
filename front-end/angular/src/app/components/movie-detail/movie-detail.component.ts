import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-movie-detail',
  templateUrl: './movie-detail.component.html',
  styleUrls: ['./movie-detail.component.css']
})
export class MovieDetailComponent implements OnInit {

  movie: any = null;

  constructor(private route: ActivatedRoute, private http: HttpClient) {}

  genreMap: { [key: number]: string } = {
    35: 'Action',
    33: 'Drama',
    38: 'Romance',
    36: 'Sci-Fi',
    41: 'Fantasy',
    39: 'Animation',
    43: 'History',
    45: 'Music',
    40: 'Family',
    46: 'Horror',
    42: 'Crime',
    34: 'Comedy',
    37: 'Thriller',
    44: 'Adventure'
  };

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');

    this.http.get(`http://127.0.0.1:8000/api/movies/${id}/`)
      .subscribe(data => {
        this.movie = data;
      });
  }

  fixImage(url: string): string {
    if (!url) return '';
    if (url.startsWith('http')) return url;
    return `http://127.0.0.1:8000${url}`;
  }

  getGenres(genres: any[]): string {
    if (!genres || genres.length === 0) return '';
    return genres.map(id => this.genreMap[id]).filter((name): name is string => !!name).join(', ');
  }
}