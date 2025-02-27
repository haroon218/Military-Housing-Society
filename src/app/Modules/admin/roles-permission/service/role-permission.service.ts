import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environments.dev';

@Injectable({
  providedIn: 'root'
})
export class RolePermissionService {

 private http = inject(HttpClient);
  public getRole(): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/admin/role/get-all`)
  }
  public addRole(payLoad: any): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/admin/role/add-edit`, payLoad)
  }
  public deleterole(role_id: any): Observable<any> {
    return this.http.delete<any>(`${environment.apiUrl}/admin/role/${role_id}`)
  }
  public updateRole( data: any): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/admin/role/add-edit`, data);
  }
  
  public getPermissions(): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/admin/permissions`)
  }
  public addPermission(payLoad: any): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/admin/permission`, payLoad)
  }
  public deletePermission(permission_id: any): Observable<any> {
    return this.http.delete<any>(`${environment.apiUrl}/admin/permission/${permission_id}`)
  }
  public updatPermission(permission_id: any, data: any): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/admin/permission/${permission_id}`, data);
  }}
