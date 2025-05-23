import { Component } from '@angular/core';

@Component({
  selector: 'app-unauthorized',
  standalone: true,
  imports: [],
  template: `
    <div style="text-align: center; margin-top: 50px;">
      <h1>Access Denied</h1>
      <p>You do not have permission to view this page.</p>
      <button mat-raised-button color="primary" routerLink="/login">Go to Login</button>
    </div>
  `,
  styleUrl: './unauthorized.component.css'
})
export class UnauthorizedComponent { }
