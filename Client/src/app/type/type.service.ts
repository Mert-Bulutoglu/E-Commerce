import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TypeService {
  Url = environment.baseUrl + 'type';
  constructor(
    private http: HttpClient,
  ) { }

  getAllTypes(): any {
    return this.http.get<any>(this.Url)
  }
  
  createType(type: any) {
    return this.http.post<any>(this.Url, type);
  }
  
  getType(id: string) {
    const data: string = JSON.stringify(id);
    return this.http.get<any>(this.Url + '/' + id,
        {
          params: new HttpParams()
            .set('data', data)
        }
      )
  }
  
  deleteType(id: number | string) {
    const data: string = JSON.stringify(id);
    return this.http.delete<any>(this.Url + '/' + id,
      {
        params: new HttpParams()
          .set('data', data)
      }
    )
  }
}
