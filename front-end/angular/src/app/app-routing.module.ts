import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MovieDetailComponent } from './components/movie-detail/movie-detail.component';
import { MoviesComponent } from './components/movies/movies.component';
import { LoginComponent } from './components/login/login.component';
import { FormsModule } from '@angular/forms';

import { ProfileComponent } from './components/profile/profile.component';
import { ReviewComponent } from './components/review/review.component';
import { WatchlistComponent } from './components/watchlist/watchlist.component';
import { RegisterComponent } from './components/register/register.component';

const routes: Routes = [
  { path: '', component: MoviesComponent },
  { path: 'movies', component: MoviesComponent },
  { path: 'genre/:genre', component: MoviesComponent },
  { path: 'movie/:id', component: MovieDetailComponent },
  { path: 'login', component: LoginComponent},
  { path: 'register', component: RegisterComponent},
  { path: 'profile', component: ProfileComponent },
  { path: 'review', component: ReviewComponent },
  { path: 'watchlist', component: WatchlistComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes), FormsModule],
  exports: [RouterModule]
})
export class AppRoutingModule {}