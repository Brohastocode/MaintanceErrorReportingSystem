import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ThemeService} from '../../services/theme.service'; // Ha standalone komponens

@Component({
  selector: 'app-theme-toggle',
  standalone: true, // Ha standalone komponensként használod
  imports: [CommonModule], // Ha standalone, ide kell a CommonModule
  templateUrl: './theme-toggle.component.html',
  styleUrls: ['./theme-toggle.component.css']
})
export class ThemeToggleComponent implements OnInit {
  isDarkMode = false; // A kapcsoló aktuális állapota

  constructor(private themeService: ThemeService) { }

  ngOnInit(): void {
    this.themeService.themeChanges.subscribe(theme => {
      this.isDarkMode = theme === 'dark';
    });
  }

  onToggleChange(): void {
    this.themeService.toggleTheme();
  }
}
