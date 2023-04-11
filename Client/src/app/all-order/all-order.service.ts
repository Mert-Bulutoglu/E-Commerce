import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { IUpdateOrder } from '../shared/models/updateOrder';

@Injectable({
  providedIn: 'root'
})
export class AllOrderService {

  Url = environment.baseUrl + 'orders';
  constructor(
    private http: HttpClient,
  ) { }


  getAllOrders(): any {
    return this.http.get<any>(this.Url + '/' + 'getOrders')
  }
  
  
  getOrder(id: string) {
    const data: string = JSON.stringify(id);
    return this.http.get<any>(this.Url + '/' +'getOrders' + '/' + id,
        {
          params: new HttpParams()
            .set('data', data)
        }
      )
  }
  
  deleteOrder(id: number | string) {
    const data: string = JSON.stringify(id);
    return this.http.delete<any>(this.Url + '/' + id,
      {
        params: new HttpParams()
          .set('data', data)
      }
    )
  }

  updateOrder(id: number, order: IUpdateOrder) {
    return this.http.put<any>(this.Url + '/' + id, order,
      {
        params: new HttpParams()
      }
    )
  }
}
