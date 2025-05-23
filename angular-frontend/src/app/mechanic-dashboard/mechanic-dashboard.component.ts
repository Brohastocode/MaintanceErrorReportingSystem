
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-mechanic-dashboard',
  standalone: true,
  imports: [CommonModule, MatButtonModule],
  template: `
    <div style="padding: 20px;">
      <h1>Mechanic Dashboard</h1>
      <p>Welcome, Mechanic!</p>
      <button mat-raised-button color="primary" style="margin-right: 10px;">View My Tasks</button>
      <button mat-stroked-button color="warn" (click)="logout()">Logout</button>
    </div>
  `,
  styleUrl: './mechanic-dashboard.component.css'
})
export class MechanicDashboardComponent {
  private router = inject(Router);

  logout(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRole');
    localStorage.removeItem('loggedInUser');

    this.router.navigate(['/login']);
    console.log('User logged out.');
  }
}
