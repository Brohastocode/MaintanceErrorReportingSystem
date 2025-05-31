import { Component, inject, OnInit,OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon'; // Ikonokhoz
import { Device, DeviceService } from '../../services/DeviceService';
import { Subscription } from 'rxjs';
import {MatCardModule} from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { ErrorReport, ErrorReportService } from '../../services/error-report.service';
import { ReportIssueDialogComponent } from './report-issue-dialog.component';

@Component({
  selector: 'app-operator-dashboard',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, MatCardModule,MatDialogModule,FormsModule],
  templateUrl: 'operator-dashboard.component.html',
  styleUrl: './operator-dashboard.component.css'
})
export class OperatorDashboardComponent implements OnInit, OnDestroy {
  devices: Device[] = [];
  private deviceService = inject(DeviceService);
  private errorReportService= inject(ErrorReportService);
  private dialog = inject(MatDialog);

  private devicesSubscription: Subscription | undefined;

  userRole: string | null = null;
  isLoggedIn: boolean = false;

  ngOnInit(): void {
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
    console.log('OperatorDashboardComponent: Attempting to load devices...');
    this.devicesSubscription = this.deviceService.getAllDevices().subscribe({
      next: (data) => {
        this.devices = data;
        console.log('OperatorDashboardComponent: Devices loaded:', this.devices);
      },
      error: (err) => {
        console.error('OperatorDashboardComponent: Failed to load devices:', err);
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

  reportIssue(device: Device): void {
    const dialogRef = this.dialog.open(ReportIssueDialogComponent, {
      width: '400px',
      data: { deviceName: device.name, deviceId: device.id } // Átadjuk az adatokat a dialógusnak
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.description) { // Ha a felhasználó megadott leírást és bezárta
        const newReport: ErrorReport = {
          description: result.description,
          device: device // A teljes eszköz objektumot adjuk át
          // reportedBy-t a backend fogja beállítani a bejelentkezett felhasználó alapján
        };

        this.errorReportService.createReport(newReport).subscribe({
          next: (createdReport) => {
            console.log('Error report created:', createdReport);
            // Frissítenünk kell az eszköz státuszát a frontenden is,
            // mivel a backend a jelentés létrehozásakor `REPORTED_ISSUE`-ra állította.
            // A legegyszerűbb, ha újra betöltjük az összes eszközt.
            this.loadDevices();
          },
          error: (err) => {
            console.error('Failed to create error report:', err);
            // Hibaüzenet megjelenítése
          }
        });
      } else {
        console.log('Error report cancelled or no description provided.');
      }
    });
  }
}

