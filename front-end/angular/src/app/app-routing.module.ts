import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MovieDetailComponent } from './components/movie-detail/movie-detail.component';
import { MoviesComponent } from './components/movies/movies.component';
import { LoginComponent } from './components/login/login.component';

const routes: Routes = [
  { path: '', redirectTo: 'movies', pathMatch: 'full'},
  { path: 'movies', component: MoviesComponent },
  { path: 'genre/:genre', component: MoviesComponent },
  { path: 'movie/:id', component: MovieDetailComponent },
  { path: 'login', component: LoginComponent},
  { path: 'register', component: LoginComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}