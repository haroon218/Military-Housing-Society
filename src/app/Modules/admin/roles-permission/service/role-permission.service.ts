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
  public getBlocks(): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/Blocks/getBlocks`)
  }
  public getAreas(): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/Area/getAreas`)
  }
  public addPermission(payLoad: any): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/admin/permission`, payLoad)
  }
  public addArea(payLoad: any): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/Area/addArea`, payLoad)
  }
  public addBlock(payLoad: any): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/Blocks/addBlock`, payLoad)
  }
  public deletePermission(permission_id: any): Observable<any> {
    return this.http.delete<any>(`${environment.apiUrl}/admin/permission/${permission_id}`)
  }
  public deleteArea(permission_id: any): Observable<any> {
    return this.http.delete<any>(`${environment.apiUrl}/Area/delete-Area/${permission_id}`)
  }
  public deleteBlock(permission_id: any): Observable<any> {
    return this.http.delete<any>(`${environment.apiUrl}/Blocks/delete-block/${permission_id}`)
  }
  public updatPermission(permission_id: any, data: any): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/admin/permission/${permission_id}`, data);
  }
  public updatArea(permission_id: any, data: any): Observable<any> {
    return this.http.put<any>(`${environment.apiUrl}/Area/update-Area/${permission_id}`, data);
  }
  public updatBlock(permission_id: any, data: any): Observable<any> {
    return this.http.put<any>(`${environment.apiUrl}/Blocks/update-block/${permission_id}`, data);
  }
}
