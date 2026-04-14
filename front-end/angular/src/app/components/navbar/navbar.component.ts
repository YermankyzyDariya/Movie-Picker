import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  searchQuery = '';

  constructor(public authService: AuthService, public router: Router) {}
  
  onSearch(): void {
    const query = this.searchQuery.trim();
    if (query) {
      this.router.navigate(['/search', query]);
      this.searchQuery = '';
    }
  }
  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}