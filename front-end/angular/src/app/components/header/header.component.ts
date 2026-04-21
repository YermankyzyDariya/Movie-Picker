import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true, 
  imports: [FormsModule, CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  query: string = '';
  searchTerm: string = '';

  constructor(private router: Router) {}

  search() {
    this.router.navigate(['/movies'], {
      queryParams: { q: this.query }
    });
  }
  onSearch() {
    console.log('search clicked');
  }
  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }
}
