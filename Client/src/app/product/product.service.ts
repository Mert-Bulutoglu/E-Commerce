import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { IProduct } from '../shared/models/product';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  Url = environment.baseUrl + 'products';
  constructor(
    private http: HttpClient,
  ) { }

  getAllProducts(): any {
    return this.http.get<any>(this.Url + '/' + 'GetProductOnly')
  }
  
  createProduct(product: any) {
    return this.http.post<any>(this.Url, product);
  }


  
  getProduct(id: string) {
    const data: string = JSON.stringify(id);
    return this.http.get<any>(this.Url + '/' + id,
        {
          params: new HttpParams()
            .set('data', data)
        }
      )
  }


  
  deleteProduct(id: number | string) {
    const data: string = JSON.stringify(id);
    return this.http.delete<any>(this.Url + '/' + id,
      {
        params: new HttpParams()
          .set('data', data)
      }
    )
  }

  uploadFile(file: File) {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<string>('/api/upload', formData);
  }

  updateProduct(id: number, product: IProduct) {
    return this.http.put<any>(this.Url + '/' + id, product,
      {
        params: new HttpParams()
      }
    )
  }
}
