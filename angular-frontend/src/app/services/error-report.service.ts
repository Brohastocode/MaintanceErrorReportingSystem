import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, of} from 'rxjs'; // Hozzáadtuk az 'of'-ot a hibakezeléshez
import {catchError} from 'rxjs/operators'; // Hozzáadtuk a 'catchError'-t
import {Device} from './DeviceService';
import {environment} from '../../environments/environment';

export interface User {
  id: number;
  username: string;
}

export interface ErrorReport {
  id?: number;
  description: string;
  device: Device;
  reportedBy?: User;
  status?: 'OPEN' | 'CLOSED'; // A korábbi hibajelentésekben 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' volt, ellenőrizd, melyik a helyes!
  reportedAt?: number[];
  resolvedAt?: number[];
  resolverNote?: string;
  resolvedBy?: User | null;
}

@Injectable({
  providedIn: 'root'
})
export class ErrorReportService {
  private apiUrl = `${environment.apiUrl}/api/reports`;

  constructor(private http: HttpClient) {
  }

  createReport(report: ErrorReport): Observable<ErrorReport> {
    console.log('Sending POST request to create report:', report);
    return this.http.post<ErrorReport>(this.apiUrl, report);
  }

  getAllReports(): Observable<ErrorReport[]> {
    return this.http.get<ErrorReport[]>(this.apiUrl);
  }

  getOpenReports(): Observable<ErrorReport[]> {
    return this.http.get<ErrorReport[]>(`${this.apiUrl}/open`);
  }

  closeReport(reportId: number, resolverNote: string): Observable<ErrorReport> {
    const url = `${this.apiUrl}/${reportId}/close`;
    return this.http.put<ErrorReport>(url, {resolverNote});
  }

  getLatestErrorReport(): Observable<ErrorReport | null> { // Módosítottuk a visszatérési típust null-ra is
    return this.http.get<ErrorReport>(`${this.apiUrl}/latest`).pipe(
      catchError(error => {
        // Ha 404-es hibát kapunk (azaz nincs legfrissebb report), akkor null-t adunk vissza.
        // Más hibák esetén továbbdobunk.
        if (error.status === 404) {
          console.warn('No latest error report found (404).');
          return of(null);
        }
        console.error('Error fetching latest error report:', error);
        throw error;
      })
    );
  }
  getErrorReportByDeviceId(deviceId: number): Observable<ErrorReport | null> {
    return this.http.get<ErrorReport>(`${this.apiUrl}/device/${deviceId}`).pipe(
      catchError(error => {
        if (error.status === 404) {
          console.warn(`No error report found for device ID: ${deviceId} (404).`);
          return of(null);
        }
        console.error(`Error fetching report for device ${deviceId}:`, error);
        throw error;
      })
    );
  }
}
