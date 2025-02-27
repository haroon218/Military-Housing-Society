import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { LoginPayload, LoginResponse } from '../components/login/login.component';
import { environment } from '../../../../environments/environments.dev';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private http:HttpClient) { }
  public Login(payLoad: any): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/admin/login`, payLoad)
  }
}
