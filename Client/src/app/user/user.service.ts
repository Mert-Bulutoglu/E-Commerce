import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { IUsers } from '../shared/models/users';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  Url = environment.baseUrl + 'user';
  constructor(
    private http: HttpClient,
  ) { }

  getAllUsers(): any {
    return this.http.get<any>(this.Url)
  }

  getUserRoles(): any{
    return this.http.get<any>(this.Url + '/' + 'roles')
  }
  
  createUser(user: any) {
    return this.http.post<any>(this.Url, user);
  }
  
  getUser(id: string) {
    const data: string = JSON.stringify(id);
    return this.http.get<any>(this.Url + '/' + id,
        {
          params: new HttpParams()
            .set('data', data)
        }
      )
  }
  
  deleteUser(id: number | string) {
    const data: string = JSON.stringify(id);
    return this.http.delete<any>(this.Url + '/' + id,
      {
        params: new HttpParams()
          .set('data', data)
      }
    )
  }

  updateUser(id: number, user: IUsers) {
    return this.http.put<any>(this.Url + '/' + id, user,
      {
        params: new HttpParams()
      }
    )
  }

  
}
