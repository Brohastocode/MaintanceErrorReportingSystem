
import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd, RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule
  ],
  template: `
    <mat-toolbar color="primary"> <span>Maintanence Error Reporting System</span>

      <span class="spacer"></span>

      <ng-container *ngIf="userRole === 'MECHANIC'">
        <button mat-button routerLink="/mechanic-dashboard">Mechanic Dashboard</button>
        <button mat-button routerLink="/mechanic-tasks">My Tasks</button>
      </ng-container>

      <ng-container *ngIf="userRole === 'OPERATOR'">
        <button mat-button routerLink="/operator-dashboard">Operator Dashboard</button>
        <button mat-button routerLink="/report-issue">Report Issue</button>
      </ng-container>

      <button mat-flat-button color="warn" (click)="logout()">
        <mat-icon>logout</mat-icon> Logout
      </button>
    </mat-toolbar>
  `,
  styles: `
    .spacer {
      flex: 1 1 auto;
    }
  `
})
export class NavbarComponent implements OnInit, OnDestroy {
  isLoggedIn: boolean = false;
  userRole: string | null = null;
  private router = inject(Router);
  private routerSubscription: Subscription | undefined;

  ngOnInit(): void {
    this.checkLoginStatus();

    this.routerSubscription = this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.checkLoginStatus();
      }
    });
  }

  ngOnDestroy(): void {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  checkLoginStatus(): void {
    this.isLoggedIn = !!localStorage.getItem('authToken');
    this.userRole = localStorage.getItem('userRole');
  }

  logout(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRole');
    localStorage.removeItem('loggedInUser');
    this.router.navigate(['/login']);
  }
}
