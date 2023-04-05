import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { IBrand } from '../shared/models/brand';

@Injectable({
  providedIn: 'root'
})
export class BrandService {
  Url = environment.baseUrl + 'brand';
  constructor(
    private http: HttpClient,
  ) { }

getAllBrands(): any {
  return this.http.get<any>(this.Url)
}

createBrand(brand: any) {
  return this.http.post<any>(this.Url, brand);
}

getBrand(id: string) {
  const data: string = JSON.stringify(id);
  return this.http.get<any>(this.Url + '/' + id,
      {
        params: new HttpParams()
          .set('data', data)
      }
    )
}

deleteBrand(id: number | string) {
  const data: string = JSON.stringify(id);
  return this.http.delete<any>(this.Url + '/' + id,
    {
      params: new HttpParams()
        .set('data', data)
    }
  )
}

}
