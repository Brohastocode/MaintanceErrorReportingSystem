import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Router, RouterModule } from '@angular/router'; // RouterModule a linkekhez
import { HttpClient } from '@angular/common/http';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import {environment} from '../../environments/environment'; // Értesítés a regisztrációról

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatSelectModule,
    RouterModule,
    MatSnackBarModule
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  user = {
    username : '',
    password: '',
    role: ''
  };

  role = [
    { display: 'Mechanic', value: 'MECHANIC' },
    { display: 'Operator', value: 'OPERATOR' }
  ];

  registerValid: boolean = true;

  router = inject(Router);
  private http = inject(HttpClient);
  private snackBar = inject(MatSnackBar);

  register() {
    if (!this.user.username || !this.user.password || !this.user.role) {
      this.registerValid = false;
      return;
    }

    const apiUrl = `${environment.apiUrl}/api/users`;
    const registerData = {
      username: this.user.username,
      password: this.user.password,
      role: this.user.role
    };

    this.http.post<any>(apiUrl, registerData)
      .subscribe({
        next: (response) => {
          console.log('Registration successful!', response);
          this.registerValid = true;
          this.snackBar.open('Registration successful! Please login.', 'Close', {
            duration: 3000,
            panelClass: ['success-snackbar']
          });
          this.router.navigate(['/login']); // Sikeres regisztráció után átirányítás a bejelentkezési oldalra
        },
        error: (error) => {
          console.error('Registration failed!', error);
          this.registerValid = false;
          const errorMessage = error.error?.message || 'Registration failed. Please try again.';
          this.snackBar.open(errorMessage, 'Close', {
            duration: 5000,
            panelClass: ['error-snackbar']
          });
        }
      });
  }
}
