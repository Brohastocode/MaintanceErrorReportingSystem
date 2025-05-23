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
    <p style="color: red; background-color: yellow; padding: 5px;">DEBUG - Is Logged In (Navbar): {{ isLoggedIn }}</p>
    <p style="color: red; background-color: yellow; padding: 5px;">DEBUG - User Role (Navbar): {{ userRole }}</p>

    <mat-toolbar color="primary" *ngIf="isLoggedIn">
      <span>Maintanence Error Reporting System</span>

      <span class="spacer"></span> <ng-container *ngIf="userRole === 'MECHANIC'">
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
    // DEBUG: Ezt a logot kell látnunk, amikor a komponens inicializálódik
    console.log('--- NavbarComponent: ngOnInit called. ---');
    this.checkLoginStatus(); // Ellenőrizzük a bejelentkezési állapotot a kezdetekor

    // Figyeljük a router eseményeit, hogy frissüljön a navbar (pl. bejelentkezés/kijelentkezés után)
    this.routerSubscription = this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        console.log('--- NavbarComponent: NavigationEnd event detected. Checking login status. ---');
        this.checkLoginStatus();
      }
    });
  }

  ngOnDestroy(): void {
    // Fontos, hogy leiratkozzunk az RxJS Subscription-ről, ha a komponens elpusztul
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
      console.log('--- NavbarComponent: Unsubscribed from router events. ---');
    }
  }

  checkLoginStatus(): void {
    const token = localStorage.getItem('authToken');
    const role = localStorage.getItem('userRole');

    // Az isLoggedIn true, ha van token, egyébként false
    this.isLoggedIn = !!token;
    this.userRole = role;

    // DEBUG: Ezek a logok mutatják a localStorage tartalmát és a komponens állapotát
    console.log('--- NavbarComponent: checkLoginStatus called. ---');
    console.log('--- NavbarComponent: localStorage authToken:', token ? 'Present' : 'Not Present');
    console.log('--- NavbarComponent: localStorage userRole:', this.userRole);
    console.log('--- NavbarComponent: isLoggedIn state:', this.isLoggedIn);
    console.log('--- NavbarComponent: userRole state (property):', this.userRole);
  }

  logout(): void {
    // Töröljük a session adatokat a localStorage-ból
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRole');
    localStorage.removeItem('loggedInUser'); // Ha ezt a kulcsot is használod

    // Átirányítás a login oldalra
    this.router.navigate(['/login']);
    console.log('User logged out via Navbar.');
  }
}
