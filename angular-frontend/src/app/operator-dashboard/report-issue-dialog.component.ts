// src/app/operator-dashboard/report-issue-dialog/report-issue-dialog.component.ts

import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-report-issue-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './report-issue-dialog.component.html',
  styleUrl: './report-issue-dialog.component.css'
})
export class ReportIssueDialogComponent {
  description: string = '';

  constructor(
    public dialogRef: MatDialogRef<ReportIssueDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { deviceName: string, deviceId: number } // Itt kapjuk az adatokat
  ) {}

  onCancel(): void {
    this.dialogRef.close();
  }

  onConfirm(): void {
    this.dialogRef.close({ description: this.description });
  }
}
