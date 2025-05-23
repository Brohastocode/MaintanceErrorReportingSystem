import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Device {
  id: number;
  name: string;
  location: string;
  status: 'OPERATIONAL' | 'REPORTED_ISSUE' | 'IN_MAINTENANCE';
}

@Injectable({
  providedIn: 'root'
})
export class DeviceService {
  private apiUrl = 'http://localhost:8080/api/devices';

  constructor(private http: HttpClient) { }


  getAllDevices(): Observable<Device[]> {
    console.log('Sending GET request to:', this.apiUrl);
    return this.http.get<Device[]>(this.apiUrl);
  }

  updateDeviceStatus(deviceId: number, newStatus: Device['status']): Observable<Device> {
    const url = `${this.apiUrl}/${deviceId}/status?newStatus=${newStatus}`;
    console.log('Sending PUT request to:', url);
    return this.http.put<Device>(url, {});
  }
}
