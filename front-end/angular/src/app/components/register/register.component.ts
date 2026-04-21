import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, RouterModule],
  providers: [HttpClient],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  username = '';
  password = '';
  confirmPassword = '';

  constructor(private http: HttpClient, private router: Router) {}

  rregister() {
  if (this.password !== this.confirmPassword) {
    alert('Passwords do not match');
    return;
  }

  this.http.post('http://127.0.0.1:8000/api/register/', {
    username: this.username,
    password: this.password
  }).subscribe({
    next: () => {
      this.router.navigate(['/login']);
    },
    error: () => {
      alert('Registration failed');
    }
  });
}
}