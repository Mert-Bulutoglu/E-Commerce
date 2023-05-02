import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgxFileDropEntry } from 'ngx-file-drop';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss']
})
export class FileUploadComponent {

  constructor(private http: HttpClient) { }

  Url = environment.baseUrl
  public files: NgxFileDropEntry[];

  @Input() options: Partial<FileUploadOptions>;
  @Output() fileUrl = new EventEmitter<string>();

  public selectedFiles(files: NgxFileDropEntry[]) {
    this.files = files;
    const fileData: FormData = new FormData();
    for (const file of files) {
      (file.fileEntry as FileSystemFileEntry).file((_file: File) => {
        fileData.append('files', _file, _file.name);
      });
    }

    const url = this.Url + `${this.options.controller}/${this.options.action}`;
    const headers = new HttpHeaders().set('Content-Disposition', 'multipart/form-data');
    headers.set('responseType', 'blob');
    this.http.post<UploadResponse>(url, fileData, { headers }).subscribe(data => {
      console.log(data);
      // Depolanan URL'yi emit et
      this.fileUrl.emit(data['url']);
    }, (err: any) => {
      console.log(err);
    });
  }
}





interface UploadResponse {
  url: string;
}

export class FileUploadOptions {
  controller?: string;
  action?: string;
  queryString?: string;
  explanation?: string;
  accept?: string;
}