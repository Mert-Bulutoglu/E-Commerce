import { HttpClient } from '@angular/common/http';
import { Component,OnInit } from '@angular/core';
import { IProduct } from './models/product';
import { IPagination } from './models/pagination';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'Commerce';
  products: IProduct[]; //Property

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.http.get('https://localhost:7108/api/products?pageSize=58').subscribe((response: IPagination) => {
      this.products = response.data;
    }, error => {
      console.error();
    });

  }
}
