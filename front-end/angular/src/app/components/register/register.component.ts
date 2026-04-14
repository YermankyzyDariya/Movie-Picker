import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  username = '';
  password = '';
  confirmPassword = '';

  constructor(private router: Router) {}

  register() {
    console.log('Register clicked');
    console.log('Username:', this.username);
    console.log('Password:', this.password);
    console.log('Confirm password:', this.confirmPassword);

    alert('Registration form submitted');
    this.router.navigate(['/login']);
  }
}