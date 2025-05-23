

import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-operator-dashboard',
  standalone: true,
  imports: [CommonModule, MatButtonModule],
  template: `
    <div style="padding: 20px;">
      <h1>Operator Dashboard</h1>
      <p>Welcome, Operator!</p>
      <button mat-raised-button color="accent" style="margin-right: 10px;">Report New Issue</button>
      <button mat-stroked-button color="warn" (click)="logout()">Logout</button>
    </div>
  `,
  styleUrl: './operator-dashboard.component.css'
})
export class OperatorDashboardComponent {
  // Router injektálása
  private router = inject(Router);

  logout(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRole');
    localStorage.removeItem('loggedInUser');


    this.router.navigate(['/login']);
    console.log('User logged out.');
  }
}
