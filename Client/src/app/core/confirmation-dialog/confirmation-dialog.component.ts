import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ConfirmationDialog } from 'src/app/shared/models/confirmation-dialog';

@Component({
  selector: 'app-confirmation-dialog',
  templateUrl: './confirmation-dialog.component.html',
  styleUrls: ['./confirmation-dialog.component.scss']
})
export class ConfirmationDialogComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<ConfirmationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ConfirmationDialog,
  ) { }

  ngOnInit(): void {
  }

  closeModal(): void {
    this.dialogRef.close({success: false, data: this.data.data});
  }

  confirmDelete(): void{
    this.dialogRef.close({success: true, data: this.data.data});
  }

}
