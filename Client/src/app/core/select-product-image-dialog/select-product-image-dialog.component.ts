import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ConfirmationDialog } from 'src/app/shared/models/confirmation-dialog';
import { FileUploadOptions } from '../file-upload/file-upload.component';

@Component({
  selector: 'app-select-product-image-dialog',
  templateUrl: './select-product-image-dialog.component.html',
  styleUrls: ['./select-product-image-dialog.component.scss']
})

export class SelectProductImageDialogComponent implements OnInit {
  options: Partial<FileUploadOptions> = {
    accept: '.png, .jpg, .jpeg, .gif',
    action: 'upload',
    controller: 'products',
    explanation: "Pass files or select files..",
  };
  files: File[] = [];
  fileUrl: string;

  @Output() fileUrlChanged = new EventEmitter<string>();
  constructor(
    public dialogRef: MatDialogRef<SelectProductImageDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ConfirmationDialog
  ) { }

  ngOnInit(): void { }

  selectedFiles(files: File[]) {
    this.files = files;
  }

  public onFileUploadSuccess(url: string): void {
    this.fileUrl = url;
    this.fileUrlChanged.emit(url);
  }

  closeModal(): void {
    if (this.files.length === 1) {
      this.dialogRef.close({ success: true, data: this.data.data, files: this.files });
    } else {
      this.dialogRef.close({ success: false, data: this.data.data, files: this.files });
    }
  }
}