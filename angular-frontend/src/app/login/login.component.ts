
import { Component, inject } from '@angular/core';
import {FormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {MatCardModule} from '@angular/material/card';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatFormFieldModule} from '@angular/material/form-field';
import {Router, RouterModule} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {MatSelectModule} from '@angular/material/select';
import {MatSnackBar,MatSnackBarModule} from '@angular/material/snack-bar';
import {environment} from '../../environments/environment';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule,
    CommonModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatSelectModule,
    RouterModule,
    MatSnackBarModule,
  ],

  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})

export class LoginComponent {
  user={
    username:'',
    password:'',
  };

  loginValid:boolean=true;

  router=inject(Router);
  private http = inject(HttpClient);
  private snackBar =inject(MatSnackBar);

  // validateLogin(email:string,password:string):boolean{
  //   return email===this.storedUser.email && password===this.storedUser.password;
  // }  NEM KELL MERT BACKEND ELLENŐRZI AZ ADATOK HITELESSÉGÉT!

  login(){
    console.log('User data: ', this.user);
    if (!this.user.username || !this.user.password) {
      this.loginValid = false;
      return;
    }
    const apiUrl = `${environment.apiUrl}/auth/login`;

    const loginData = {
      username: this.user.username,
      password: this.user.password,
    }

    this.http.post<any>(apiUrl, loginData)
      .subscribe({
        next: (response)=> {
          console.log("Login success",response);
          this.loginValid=true;
          if (response && response.token) {
            localStorage.setItem('authToken', response.token);
            localStorage.setItem('loggedInUser', JSON.stringify(this.user.username));
            localStorage.setItem('userRole', response.role);
            this.snackBar.open('Login successful!', 'Close', {
              duration: 3000,
              panelClass: ['success-snackbar']
            });
            const userRole = response.role;
            if (userRole === 'MECHANIC') {
              this.router.navigate(['/mechanic-dashboard']);
            } else if (userRole === 'OPERATOR') {
              this.router.navigate(['/operator-dashboard']);
            } else if (userRole === 'ADMIN') {
              this.router.navigate(['/admin-dashboard']);
            }else {
              console.warn('Unknown user role:', userRole);
              this.router.navigate(['/unauthorized']);
            }

          } else {
            this.snackBar.open('Login successful, but no token received.', 'Close', {
              duration: 5000,
              panelClass: ['error-snackbar']
            });
            console.warn('Login successful, but no token received.');
          }
        },
        error: (error) => {
          console.error('Login failed!', error);
          this.loginValid = false;
          const errorMessage = error.error?.message || 'Incorrect email or password. Please try again.';
          this.snackBar.open(errorMessage, 'Close', {
            duration: 5000,
            panelClass: ['error-snackbar']
          });
        }
      });
  }
}
