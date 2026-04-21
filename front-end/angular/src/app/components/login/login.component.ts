import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  username = '';
  password = '';

  constructor(private http: HttpClient, private router: Router) {}

login() {
  this.http.post<any>(
    'http://127.0.0.1:8000/api/login/', 
    {
     username: this.username,
     password: this.password
    },
    {
      headers: {
        'Content-Type': 'application/json'
      } 
    }
  ).subscribe({
    next: (res: any) => {
      console.log('login response', res);
      localStorage.setItem('token', res.token);
      this.router.navigate(['/']);
    },
    error: (err) => {
      alert('Login failed');
    }
  });
  }
}