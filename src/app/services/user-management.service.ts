import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Constants } from '../../../public/constants/constants';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserManagementService {

  constructor(private http:HttpClient) { }
  getGroups(perPage?: number, page?: number, searchTerm?: string): Observable<any> {
    const url = `${Constants.baseApi}/groups`;
    let params = new HttpParams()
    if (perPage !== null && perPage !== undefined) {
      params = params.set('per_page', perPage.toString());
    }

    if (page !== null && page !== undefined) {
      params = params.set('page', page.toString());
    }

    if (searchTerm) {
      params = params.set('search', searchTerm);
    }
    return this.http.get<any>(url, { params });
  }

  deleteGroup(groupId:any):Observable<any>{
   return this.http.delete<any>(`${Constants.baseApi}/groups/${groupId}`)
  }
  addGroup(groupdata:any){
    return this.http.post<any>(`${Constants.baseApi}/groups`,groupdata)
  }
  getGroupDetailById(groupId:any){
return this.http.get<any>(`${Constants.baseApi}/groups/${groupId}`)
  }
  fetchRegions(){
    return this.http.get<any>(`${Constants.baseApi}/regions`)
  }
  updateGroup(groupDta:any){
    return this.http.post<any>(`${Constants.baseApi}/groups/${groupDta.id}`,groupDta)
  }
  getCustomers(groupId:any): Observable<any> {


    return this.http.get<any>(`${Constants.baseApi}/companies/${groupId}`, );
  }
  getRoles(): Observable<any> {
    return this.http.get<any>(`${Constants.baseApi}/roles`, );
  }
}
