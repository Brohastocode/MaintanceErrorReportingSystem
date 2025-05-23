
import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Device, DeviceService } from '../services/DeviceService';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-mechanic-dashboard',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatCardModule, MatIconModule],
  template: `
    <h2>Mechanic Dashboard</h2>

    <div class="devices-container">
      <mat-card *ngFor="let device of devices" class="device-card">
        <mat-card-header>
          <mat-card-title>{{ device.name }}</mat-card-title>
          <mat-card-subtitle>{{ device.location }}</mat-card-subtitle>
        </mat-card-header>
        <mat-card-content>
          <p>Státusz:
            <span [style.color]="getStatusColor(device.status)" style="font-weight: bold;">
          {{ device.status }}
        </span>
          </p>
          <mat-icon [style.color]="getStatusColor(device.status)">
            {{ device.status === 'OPERATIONAL' ? 'check_circle' : 'warning' }}
          </mat-icon>
        </mat-card-content>
        <mat-card-actions *ngIf="userRole === 'MECHANIC'">
          <button mat-raised-button color="warn"
                  *ngIf="device.status === 'REPORTED_ISSUE' || device.status === 'OPERATIONAL'"
                  (click)="markAsInMaintenance(device.id)">
            <mat-icon>build</mat-icon> Mark In Maintenance
          </button>
          <button mat-raised-button color="primary"
                  *ngIf="device.status === 'IN_MAINTENANCE'"
                  (click)="markAsOperational(device.id)">
            <mat-icon>done_all</mat-icon> Mark Operational
          </button>
        </mat-card-actions>
      </mat-card>
      <div *ngIf="!devices.length">
        <p>Loading devices or no devices found...</p>
      </div>
    </div>
  `,
  styleUrl: './mechanic-dashboard.component.css'
})
export class MechanicDashboardComponent implements OnInit, OnDestroy {
  devices: Device[] = [];
  private deviceService = inject(DeviceService);
  private devicesSubscription: Subscription | undefined;

  userRole: string | null = null;
  isLoggedIn: boolean = false;

  ngOnInit(): void {
    // Frissítjük a bejelentkezési státuszt és a szerepkört
    this.isLoggedIn = !!localStorage.getItem('authToken');
    this.userRole = localStorage.getItem('userRole');

    this.loadDevices();
  }

  ngOnDestroy(): void {
    if (this.devicesSubscription) {
      this.devicesSubscription.unsubscribe();
    }
  }

  loadDevices(): void {
    console.log('MechanicDashboardComponent: Attempting to load devices...');
    this.devicesSubscription = this.deviceService.getAllDevices().subscribe({
      next: (data) => {
        this.devices = data;
        console.log('MechanicDashboardComponent: Devices loaded:', this.devices);
      },
      error: (err) => {
        console.error('MechanicDashboardComponent: Failed to load devices:', err);
      }
    });
  }

  getStatusColor(status: Device['status']): string {
    switch (status) {
      case 'OPERATIONAL':
        return 'green';
      case 'REPORTED_ISSUE':
      case 'IN_MAINTENANCE':
        return 'orange';
      default:
        return 'gray';
    }
  }

  markAsInMaintenance(deviceId: number): void {
    this.deviceService.updateDeviceStatus(deviceId, 'IN_MAINTENANCE').subscribe({
      next: (updatedDevice) => {
        console.log('Device marked as IN_MAINTENANCE:', updatedDevice);
        // Frissítjük a lokális listát, hogy azonnal megjelenjen a változás
        const index = this.devices.findIndex(d => d.id === updatedDevice.id);
        if (index > -1) {
          this.devices[index] = updatedDevice;
        }
      },
      error: (err) => {
        console.error('Failed to mark device as IN_MAINTENANCE:', err);
      }
    });
  }

  markAsOperational(deviceId: number): void {
    this.deviceService.updateDeviceStatus(deviceId, 'OPERATIONAL').subscribe({
      next: (updatedDevice) => {
        console.log('Device marked as OPERATIONAL:', updatedDevice);
        // Frissítjük a lokális listát, hogy azonnal megjelenjen a változás
        const index = this.devices.findIndex(d => d.id === updatedDevice.id);
        if (index > -1) {
          this.devices[index] = updatedDevice;
        }
      },
      error: (err) => {
        console.error('Failed to mark device as OPERATIONAL:', err);
      }
    });
  }
}
