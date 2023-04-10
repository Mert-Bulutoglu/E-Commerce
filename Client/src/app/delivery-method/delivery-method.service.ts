import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { IDeliveryMethod } from '../shared/models/deliveryMethod';

@Injectable({
  providedIn: 'root'
})
export class DeliveryMethodService {
  Url = environment.baseUrl + 'DeliveryMethod';
  constructor(
    private http: HttpClient,
  ) { }

  getAllDeliveryMethods(): any {
    return this.http.get<any>(this.Url)
  }


  createDeliveryMethod(deliveryMethod: any) {
    return this.http.post<any>(this.Url, deliveryMethod);
  }
  
  getDeliveryMethod(id: string) {
    const data: string = JSON.stringify(id);
    return this.http.get<any>(this.Url + '/' + id,
        {
          params: new HttpParams()
            .set('data', data)
        }
      )
  }
  
  deleteDeliveryMethod(id: number | string) {
    const data: string = JSON.stringify(id);
    return this.http.delete<any>(this.Url + '/' + id,
      {
        params: new HttpParams()
          .set('data', data)
      }
    )
  }

  updateDeliveryMethod(id: number, deliveryMethod: IDeliveryMethod) {
    return this.http.put<any>(this.Url + '/' + id, deliveryMethod,
      {
        params: new HttpParams()
      }
    )
  }
}
