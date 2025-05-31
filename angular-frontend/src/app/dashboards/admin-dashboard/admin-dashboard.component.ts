import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {Device, DeviceService} from '../../services/DeviceService';
import {Subscription} from 'rxjs';
import {RouterModule, RouterOutlet} from '@angular/router';

@Component({
  selector: 'app-admin-dashboard',
  imports: [
    RouterOutlet,
    RouterModule
  ],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css'
})
export class AdminDashboardComponent implements OnInit, OnDestroy {
  devices: Device[] = [];
  private deviceService = inject(DeviceService);


  private devicesSubscription: Subscription | undefined;


  userRole: string | null = null;
  isLoggedIn: boolean = false;


  ngOnInit(): void {
    this.isLoggedIn = !!localStorage.getItem('authToken');
    this.userRole = localStorage.getItem('userRole');
  }

  ngOnDestroy(): void {
    if (this.devicesSubscription) {
      this.devicesSubscription.unsubscribe();
    }
  }

  loadDevices(): void {
    console.log('Attempting to load devices...');
    this.devicesSubscription = this.deviceService.getAllDevices().subscribe({
      next: (data) => {
        this.devices = data;
        console.log('Devices loaded:', this.devices);
      },
      error: (err) => {
        console.error('Failed to load devices:', err);
      }
    });
  }
}
