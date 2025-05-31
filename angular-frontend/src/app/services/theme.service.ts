// src/app/services/theme.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  private currentTheme = new BehaviorSubject<string>(this.getInitialTheme());

  themeChanges = this.currentTheme.asObservable();

  constructor() {
    this.applyTheme(this.currentTheme.value);
  }

  private getInitialTheme(): string {
    const savedTheme = localStorage.getItem('app-theme');
    // Csak 'dark' vagy 'light' értékeket engedélyezünk
    return (savedTheme === 'dark' || savedTheme === 'light') ? savedTheme : 'light';
  }

  toggleTheme(): void {
    const newTheme = this.currentTheme.value === 'light' ? 'dark' : 'light';
    this.setTheme(newTheme);
  }

  setTheme(theme: string): void {
    if (theme === 'dark' || theme === 'light') {
      localStorage.setItem('app-theme', theme); // Mentés a localStorage-ba
      this.currentTheme.next(theme);            // Értesítés a feliratkozóknak
      this.applyTheme(theme);                  // Alkalmazás a body-ra
    } else {
      console.warn('Invalid theme provided. Only "light" and "dark" are supported.');
    }
  }

  private applyTheme(theme: string): void {
    const body = document.body;
    if (theme === 'dark') {
      body.classList.add('dark-mode');
    } else {
      body.classList.remove('dark-mode');
    }
  }

  getCurrentTheme(): string {
    return this.currentTheme.value;
  }
}
