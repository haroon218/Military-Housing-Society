import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Constants } from '../../../public/constants/constants';
import { Observable, tap } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
public companyId:any
  constructor(public http:HttpClient,private router:Router) { }
  public login(loginCredentials:any){
   
    return this.http.post<any>(`${Constants.baseApi}/login`,loginCredentials)
  
    }
    addCompany(companyData: any): Observable<any> {
      return this.http.post<any>(`${Constants.baseApi}/companies`,companyData);
    }
    addCategory(companyData: any): Observable<any> {
      return this.http.post<any>(`${Constants.baseApi}/categories`,companyData);
    }
      deleteCompany(companyId:any): Observable<any>{
      return this.http.delete<any>(`${Constants.baseApi}/companies/${companyId}`)

    }
    deleteCategory(companyId:any): Observable<any>{
      return this.http.delete<any>(`${Constants.baseApi}/categories/${companyId}`)

    }
    getCustomers(params?:{page?: number, per_page?: number}): Observable<any> {
      let httpParams = new HttpParams();
      if(params){
        if (params.per_page) {
          httpParams = httpParams.set('per_page', params.per_page.toString());
      }
      if (params.page) {
        httpParams = httpParams.set('page', params.page.toString());
    }
      }
      
        
  
      return this.http.get<any>(`${Constants.baseApi}/companies`, { params });
    }
    getUsers(params?:{page?: number, per_page?: number,search?:any}): Observable<any> {
      let httpParams = new HttpParams();
      if(params){
        if (params.per_page) {
          httpParams = httpParams.set('per_page', params.per_page.toString());
      }
      if (params.page) {
        httpParams = httpParams.set('page', params.page.toString());
    }
    if (params.search) {
      httpParams = httpParams.set('search', params.search.toString());
  }
      }
      
        
  
      return this.http.get<any>(`${Constants.baseApi}/users`, { params });
    }
    getCategories(params?:{page?: number, per_page?: number}): Observable<any> {
      let httpParams = new HttpParams();
      if(params){
        if (params.per_page) {
          httpParams = httpParams.set('per_page', params.per_page.toString());
      }
      if (params.page) {
        httpParams = httpParams.set('page', params.page.toString());
    }
      }
      
        
  
      return this.http.get<any>(`${Constants.baseApi}/categories`, { params });
    }
    updateCategory(categoryId:any,cayegory:any){
      return this.http.post<any>(`${Constants.baseApi}/categories/${categoryId}`, cayegory)
    }
    updateCompany(categoryId:any,cayegory:any){
      return this.http.post<any>(`${Constants.baseApi}/companies/${categoryId}`, cayegory)
    }
    getCompanyInformation(companyId:any){
      return this.http.get<any>(`${Constants.baseApi}/companies/${companyId}`);

    }
    getBranches(params?: { per_page?: number; page?: number; search?: string; company_id?: number }): Observable<any> {
      let httpParams = new HttpParams();
  
      if (params) {
          if (params.per_page) {
              httpParams = httpParams.set('per_page', params.per_page.toString());
          }
          if (params.page) {
              httpParams = httpParams.set('page', params.page.toString());
          }
          if (params.search) {
              httpParams = httpParams.set('search', params.search);
          }
          if (params.company_id) {
              httpParams = httpParams.set('company_id', params.company_id.toString());
          }
      }
  
      return this.http.get<any>(`${Constants.baseApi}/branches`, { params: httpParams });
  }
    addBranch(branchData: any): Observable<any> {
      return this.http.post<any>(`${Constants.baseApi}/branches`, branchData);
    }
    deleteBranch(branchId:any): Observable<any>{
      return this.http.delete<any>(`${Constants.baseApi}/branches/${branchId}`)

    }
    logout(): Observable<any> {
      return this.http.post<any>(`${Constants.baseApi}/logout`, {}).pipe(
        tap(() => {
          // Remove token from local storage
          localStorage.removeItem('token');
  
          // Navigate to the desired route after logging out
          this.router.navigate(['']); // Adjust the route as necessary
        })
      );
    }
 
    getEmployees(params?: { per_page?: number; page?: number; search?: string; role?: any }): Observable<any> {
      let httpParams = new HttpParams();
  
      if (params) {
          if (params.per_page) {
              httpParams = httpParams.set('per_page', params.per_page.toString());
          }
          if (params.page) {
              httpParams = httpParams.set('page', params.page.toString());
          }
          if (params.search) {
              httpParams = httpParams.set('search', params.search);
          }
          if (params.role) {
              httpParams = httpParams.set('role', params.role);
          }
      }
  
      return this.http.get<any>(`${Constants.baseApi}/employees`, { params: httpParams });
  }
  
      addEmployee(employeeData:any){
        return this.http.post<any>(`${Constants.baseApi}/employees`,employeeData)  

      }
      updateEmployee(employee:any){
        return this.http.put<any>(`${Constants.baseApi}/employees/${employee.id}`, employee)
      }
      updateBranch(employee:any){
        return this.http.post<any>(`${Constants.baseApi}/branches/${employee.id}`, employee)
      }
      updatePermissions(roleId:any,employee:any){
        return this.http.post<any>(`${Constants.baseApi}/roles/${roleId}`, employee)
      }
    deleteEmployees(employeeId:any): Observable<any>{
        return this.http.delete<any>(`${Constants.baseApi}/employees/${employeeId}`)

      }
      getRoles(perPage?: any, regionId?: any): Observable<any> {
        let params = new HttpParams();
        if (perPage) {
          params = params.set('per_page', perPage.toString());
        }
    
        if (regionId) {
          params = params.set('region_id', regionId.toString());
        }
    
        return this.http.get<any>(`${Constants.baseApi}/roles`, { params });
      }
      getPermissions(perPage?: any, regionId?: any): Observable<any> {
        let params = new HttpParams();
        if (perPage) {
          params = params.set('per_page', perPage.toString());
        }
    
        if (regionId) {
          params = params.set('region_id', regionId.toString());
        }
    
        return this.http.get<any>(`${Constants.baseApi}/permissions`, { params });
      }
}
