import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
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

  public selectedFiles(files: NgxFileDropEntry[]) {
    this.files = files;
    const fileData: FormData = new FormData();
    for (const file of files) {
      (file.fileEntry as FileSystemFileEntry).file((_file: File) => {
        fileData.append(_file.name, _file, _file.webkitRelativePath);
        console.log(fileData)
      });
    }

    const url = this.Url + `${this.options.controller}/${this.options.action}`;
    const headers = new HttpHeaders().set('Content-Disposition', 'multipart/form-data');
    headers.set('responseType', 'blob');
    this.http.post(url, fileData, {headers}).subscribe(data => {
      console.log(fileData);
    }, (err: any) => {
      console.log(err);
    });

  }
}

export class FileUploadOptions {
  controller?: string;
  action?: string;
  queryString?: string;
  explanation?: string;
  accept?: string;
}
