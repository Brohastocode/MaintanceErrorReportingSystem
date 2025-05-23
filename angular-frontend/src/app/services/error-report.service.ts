import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Device } from './DeviceService'; // Szükségünk van a Device interfészre


export interface ErrorReport {
  id?: number;
  description: string;
  device: Device;
  reportedBy?: any;
  status?: 'OPEN' | 'CLOSED';
  reportedAt?: string;
  resolvedAt?: string;
  resolverNote?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ErrorReportService {
  private apiUrl = 'http://localhost:8080/api/reports';

  constructor(private http: HttpClient) { }

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
    return this.http.put<ErrorReport>(url, { resolverNote });
  }
}
