import {Component, inject, OnInit, OnDestroy} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Router} from '@angular/router';
import {MatCardModule} from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {Device, DeviceService} from '../../services/DeviceService';
import {Subscription} from 'rxjs';
import {ErrorReport, ErrorReportService} from '../../services/error-report.service';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';

@Component({
  selector: 'app-mechanic-dashboard',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatCardModule, MatIconModule, MatProgressSpinnerModule],
  template: `
    <div class="mechanic-dashboard-container">
      <h2>Mechanic Dashboard</h2>
      <div class="main-content-layout">
        <div class="selected-device-details">
          <mat-card *ngIf="selectedDevice">
            <mat-card-header>
              <mat-card-title>{{ selectedDevice?.name }}</mat-card-title>
              <mat-card-subtitle>{{ selectedDevice?.location }}</mat-card-subtitle>
            </mat-card-header>
            <mat-card-content>
              <p>Státusz:
                <span [class]="'device-status-' + (selectedDevice?.status || '').toLowerCase().replace('_', '-')">
                  {{ selectedDevice?.status }}
                </span>
                <mat-icon [style.color]="getStatusColor(selectedDevice?.status)">
                  {{ selectedDevice?.status === 'OPERATIONAL' ? 'check_circle' : 'warning' }}
                </mat-icon>
              </p>

              <div class="device-report-section">
                <h4>Eszköz hibaüzenete:</h4>
                <div *ngIf="isDeviceReportLoading" class="loading-message">
                  <mat-spinner diameter="15"></mat-spinner>
                  <p>Betöltés...</p>
                </div>
                <div *ngIf="deviceReportError" class="error-message">
                  <mat-icon color="warn">error</mat-icon>
                  <p>{{ deviceReportError }}</p>
                </div>
                <div *ngIf="!isDeviceReportLoading && !deviceReportError">
                  <div *ngIf="currentDeviceErrorReport; else noDeviceReport">
                    <p><strong>Leírás:</strong> {{ currentDeviceErrorReport.description }}</p>
                    <p><strong>Jelentés ideje:</strong> {{ formatReportedAt(currentDeviceErrorReport.reportedAt) }}</p>
                    <p><strong>Jelenlegi státusz:</strong> {{ currentDeviceErrorReport.status }}</p>
                    <div *ngIf="currentDeviceErrorReport.resolvedBy">
                      <p><strong>Megoldotta:</strong> {{ currentDeviceErrorReport.resolvedBy?.username }}</p>
                      <p><strong>Megoldás
                        dátuma:</strong> {{ formatReportedAt(currentDeviceErrorReport.resolvedAt || []) }}</p>
                      <p><strong>Megoldói megjegyzés:</strong> {{ currentDeviceErrorReport.resolverNote }}</p>
                    </div>
                  </div>
                  <ng-template #noDeviceReport>
                    <p class="no-report-message">Nincs rögzített hibaüzenet ehhez az eszközhöz.</p>
                  </ng-template>
                </div>
              </div>
            </mat-card-content>
            <mat-card-actions *ngIf="userRole === 'MECHANIC'">
              <button mat-raised-button color="warn"
                      *ngIf="selectedDevice?.status === 'REPORTED_ISSUE' || selectedDevice?.status === 'OPERATIONAL'"
                      (click)="markAsInMaintenance(selectedDevice.id)">
                <mat-icon>build</mat-icon>
                Mark In Maintenance
              </button>
              <button mat-raised-button color="primary"
                      *ngIf="selectedDevice?.status === 'IN_MAINTENANCE'"
                      (click)="markAsOperational(selectedDevice.id)">
                <mat-icon>done_all</mat-icon>
                Mark Operational
              </button>
            </mat-card-actions>
          </mat-card>
          <div *ngIf="showNoSelectionMessage" class="no-selection-message">
            <p>Válassz ki egy eszközt a részletek megtekintéséhez.</p>
          </div>
        </div>

        <div class="right-sidebar-layout">
          <div class="devices-grid">
            <mat-card
              *ngFor="let device of devices"
              class="device-grid-card"
              [class.selected-device-card]="device.id === selectedDeviceId"
              (click)="selectDevice(device.id)">
              <mat-card-header>
                <mat-card-title>{{ device.name }}</mat-card-title>
              </mat-card-header>
              <mat-card-content>
                <p>Státusz:
                  <span [class]="'device-status-' + (device.status || '').toLowerCase().replace('_', '-')">
                    {{ device.status }}
                  </span>
                </p>
                <mat-icon [style.color]="getStatusColor(device.status)">
                  {{ device.status === 'OPERATIONAL' ? 'check_circle' : 'warning' }}
                </mat-icon>
              </mat-card-content>
            </mat-card>
            <div *ngIf="!devices.length" class="no-devices-message">
              <p>Eszközök betöltése vagy nem található eszközök...</p>
            </div>
          </div>

          <mat-card class="latest-report-card">
            <mat-card-header>
              <mat-card-title>Utolsó beérkezett hibaüzenet</mat-card-title>
            </mat-card-header>
            <mat-card-content>
              <div *ngIf="isLoading" class="loading-message">
                <mat-spinner diameter="20"></mat-spinner>
                <p>Üzenet betöltése...</p>
              </div>

              <div *ngIf="errorMessage" class="error-message">
                <mat-icon color="warn">error</mat-icon>
                <p>{{ errorMessage }}</p>
                <button mat-raised-button color="primary" (click)="loadLatestReport()">Újratöltés</button>
              </div>

              <div *ngIf="!isLoading && !errorMessage">
                <div *ngIf="latestErrorReport; else noReport">
                  <div class="report-details">
                    <p><strong>Leírás:</strong> {{ latestErrorReport.description }}</p>
                    <p><strong>Eszköz:</strong> {{ latestErrorReport.device.name }}
                      ({{ latestErrorReport.device.location }})</p>
                    <p><strong>Eszköz státusza:</strong> {{ latestErrorReport.device.status }}</p>
                    <p><strong>Jelentette:</strong> {{ latestErrorReport.reportedBy?.username }}</p>
                    <p><strong>Jelentés ideje:</strong> {{ formatReportedAt(latestErrorReport.reportedAt) }}</p>
                    <p><strong>Jelenlegi státusz:</strong> {{ latestErrorReport.status }}</p>

                    <div *ngIf="latestErrorReport.resolvedBy">
                      <p><strong>Megoldotta:</strong> {{ latestErrorReport.resolvedBy?.username }}</p>
                      <p><strong>Megoldás dátuma:</strong> {{ formatReportedAt(latestErrorReport.resolvedAt || []) }}
                      </p>
                      <p><strong>Megoldói megjegyzés:</strong> {{ latestErrorReport.resolverNote }}</p>
                    </div>
                  </div>
                </div>
                <ng-template #noReport>
                  <p class="no-report-message">Jelenleg nincs rögzített hibaüzenet.</p>
                </ng-template>
              </div>
            </mat-card-content>
          </mat-card>
        </div>
      </div>
    </div>
  `,
  styleUrl: './mechanic-dashboard.component.css'
})
export class MechanicDashboardComponent implements OnInit, OnDestroy {
  devices: Device[] = [];
  private deviceService = inject(DeviceService);
  private devicesSubscription: Subscription | undefined;

  latestErrorReport: ErrorReport | null = null;
  errorMessage: string | null = null;
  isLoading: boolean = true; // Betöltési állapot jelzése

  private errorReportService = inject(ErrorReportService);

  userRole: string | null = null;
  isLoggedIn: boolean = false;

  selectedDeviceId: number | null = null;
  currentDeviceErrorReport: ErrorReport | null = null;
  isDeviceReportLoading: boolean = false;
  deviceReportError: string | null = null;

  ngOnInit(): void {
    this.isLoggedIn = !!localStorage.getItem('authToken');
    this.userRole = localStorage.getItem('userRole');

    this.loadDevices();
    this.loadLatestReport();
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
        if (this.devices.length > 0) {
          const problematicDevice = this.devices.find(d => d.status === 'REPORTED_ISSUE');
          if (problematicDevice) {
            // Most már meghívjuk a selectDevice-ot, ami betölti az eszköz specifikus hibajelentést is
            this.selectDevice(problematicDevice.id);
          } else {
            // Ha nincs problémás eszköz, válasszuk ki az elsőt
            this.selectDevice(this.devices[0].id);
          }
        }
      },
      error: (err) => {
        console.error('MechanicDashboardComponent: Failed to load devices:', err);
      }
    });
  }

  loadLatestReport(): void {
    this.isLoading = true; // Betöltés elkezdése
    this.errorMessage = null; // Korábbi hibaüzenetek törlése

    this.errorReportService.getLatestErrorReport().subscribe({
      next: (report: ErrorReport | null) => {
        this.latestErrorReport = report;
        this.isLoading = false;
        if (report && report.device && report.device.id && this.selectedDeviceId === null) {
          this.selectedDeviceId = report.device.id;
        }
      },
      error: (error) => {
        this.errorMessage = this.handleReportError(error);
        this.isLoading = false;
        this.latestErrorReport = null;
      }
    });
  }

  selectDevice(deviceId: number): void {
    this.selectedDeviceId = deviceId;
    this.loadDeviceSpecificReport(deviceId);
  }

  loadDeviceSpecificReport(deviceId: number): void {
    this.isDeviceReportLoading = true;
    this.deviceReportError = null;
    this.currentDeviceErrorReport = null;

    this.errorReportService.getErrorReportByDeviceId(deviceId).subscribe({
      next: (report: ErrorReport | null) => {
        this.currentDeviceErrorReport = report;
        this.isDeviceReportLoading = false;
        this.deviceReportError = null;
      },
      error: (err) => {
        console.error(`Failed to load error report for device ${deviceId}:`, err);
        // Kezeljük a 404-es hibát külön, ha nincs report
        if (err.status === 404) {
          this.deviceReportError = 'Nincs rögzített hibaüzenet ehhez az eszközhöz.';
        } else {
          this.deviceReportError = 'Hiba történt az eszköz hibaüzenetének betöltésekor. Kérjük, próbáld újra.';
        }
        this.currentDeviceErrorReport = null;
        this.isDeviceReportLoading = false;
      }
    });
  }

  formatReportedAt(reportedAtArray: number[] | string | undefined): string {
    if (!reportedAtArray) {
      return 'Nincs adat';
    }

    if (typeof reportedAtArray === 'string') {
      try {
        const date = new Date(reportedAtArray);
        return date.toLocaleString();
      } catch (e) {
        return 'Érvénytelen dátum formátum';
      }
    }
    if (Array.isArray(reportedAtArray) && reportedAtArray.length >= 6) {
      const [year, month, day, hour, minute, second] = reportedAtArray;
      const date = new Date(year, month - 1, day, hour, minute, second);
      return date.toLocaleString();
    }

    return 'Ismeretlen dátum formátum';
  }

  private handleReportError(error: any): string {
    console.error('Hiba történt a hibaüzenet lekérdezésekor:', error);
    let message: string;
    switch (error.status) {
      case 403:
        message = 'Nincs jogosultságod az üzenet megtekintésére. Kérjük, jelentkezz be mechanikusként.';
        break;
      case 404:
        message = 'Jelenleg nincs rögzített hibaüzenet.';
        break;
      default:
        message = 'Hiba történt az üzenet lekérdezésekor. Kérjük, próbáld újra később.';
    }
    return message;
  }

  get selectedDevice(): Device | null {
    if (this.selectedDeviceId === null || this.devices.length === 0) {
      return null;
    }
    return this.devices.find(d => d.id === this.selectedDeviceId!) || null;
  }

  get showNoSelectionMessage(): boolean {
    return !this.selectedDeviceId || this.devices.length === 0 || !this.selectedDevice;
  }

  getStatusColor(status: Device['status'] | string | undefined | null): string {
    switch (status) {
      case 'OPERATIONAL':
        return 'green';
      case 'REPORTED_ISSUE':
      case 'IN_MAINTENANCE':
        return 'orange';
      case undefined:
      case null:
      default:
        return 'gray';
    }
  }

  markAsInMaintenance(deviceId: number): void {
    this.deviceService.updateDeviceStatus(deviceId, 'IN_MAINTENANCE').subscribe({
      next: (updatedDevice) => {
        console.log('Device marked as IN_MAINTENANCE:', updatedDevice);
        const index = this.devices.findIndex(d => d.id === updatedDevice.id);
        if (index > -1) {
          this.devices[index] = updatedDevice;
          if (this.selectedDeviceId === updatedDevice.id) {
            this.loadDeviceSpecificReport(updatedDevice.id);
          }
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
        const index = this.devices.findIndex(d => d.id === updatedDevice.id);
        if (index > -1) {
          this.devices[index] = updatedDevice;
          if (this.selectedDeviceId === updatedDevice.id) {
            if (this.currentDeviceErrorReport && this.currentDeviceErrorReport.status === 'OPEN') {
              const reportIdToClose = this.currentDeviceErrorReport.id;
              if (reportIdToClose) {
                this.errorReportService.closeReport(reportIdToClose, '').subscribe({
                  next: (closedReport) => {
                    console.log('Error report closed:', closedReport);
                    this.currentDeviceErrorReport = null;
                    this.deviceReportError = null;
                    this.isDeviceReportLoading = false;
                    this.loadLatestReport();
                  },
                  error: (reportCloseErr) => {
                    console.error('Failed to close error report after marking device operational:', reportCloseErr);
                    this.currentDeviceErrorReport = null;
                    this.deviceReportError = 'Hiba történt a hibajelentés lezárásakor.';
                    this.isDeviceReportLoading = false;
                  }
                });
              } else {
                this.currentDeviceErrorReport = null;
                this.deviceReportError = null;
                this.isDeviceReportLoading = false;
                this.loadLatestReport();
              }
            } else {
              this.currentDeviceErrorReport = null;
              this.deviceReportError = null;
              this.isDeviceReportLoading = false;
              this.loadLatestReport();
            }
          }
        }
      },
      error: (err) => {
        console.error('Failed to mark device as OPERATIONAL:', err);
        if (this.selectedDeviceId === deviceId) {
          this.currentDeviceErrorReport = null;
          this.deviceReportError = 'Hiba történt a készülék státuszának frissítésekor.';
          this.isDeviceReportLoading = false;
        }
      }
    });
  }
}
