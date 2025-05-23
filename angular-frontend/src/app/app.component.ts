import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationEnd,RouterOutlet, RouterModule, Router } from '@angular/router';
import {HttpClientModule} from '@angular/common/http';
import {NavbarComponent} from './navbar/navbar.component';
import { filter, Subscription } from 'rxjs';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterModule,
    HttpClientModule,
    NavbarComponent
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'maintance-App';
  shouldShowNavbar: boolean = false;
  private router =inject (Router);
  private routerSubscription: Subscription | undefined;

  ngOnInit(): void {
    this.checkNavbarVisibility(this.router.url);

    this.routerSubscription = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.checkNavbarVisibility(event.urlAfterRedirects);
    });
  }

  ngOnDestroy(): void {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  private checkNavbarVisibility(url: string): void {
    this.shouldShowNavbar = !(url.includes('/login') || url.includes('/register'));
    console.log(`Current URL: ${url}, Should Show Navbar: ${this.shouldShowNavbar}`); // DEBUG
  }
}


