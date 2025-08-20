import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../../../../environments/environments.dev';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  private http=inject(HttpClient)
  sharedData = new BehaviorSubject <any>({});
  public sharedData$: Observable<any> = this.sharedData.asObservable();
  constructor() { 
    this.getData()
  }
  public getData() {
    let storedData = localStorage.getItem('Data@Salvao');
    this.sharedData.next(JSON.parse(storedData || '{}'));
  }
  public sendGetRequest<T>(
    target: string,
    pathParams?: (string | number)[],    // parameters
    queryParams?: { [key: string]: any } // optional query parameters
  ): Observable<T> {
    // Without params
    // this.sendGetRequest<any>('/get-users');
    // With query
    // this.sendGetRequest<any>('/get-users', [], { search: 'Ali' });
    // With path param
    // this.sendGetRequest<any>('/user/details', [123]);
    // With both
    // this.sendGetRequest<any>('/sessions', [123], { start_date: '2024-01-01' });
    let httpParams = new HttpParams();  
    if (queryParams) {
      Object.keys(queryParams).forEach(key => {
        const value = queryParams[key];
        if (value !== null && value !== undefined && value !== '') {
          httpParams = httpParams.set(key, value);
        }
      });
    }
    // Append path parameters if provided
    if (pathParams && pathParams.length) {
      const joinedParams = pathParams.map(p => encodeURIComponent(p)).join('/');
      target = `${target}/${joinedParams}`;
    }  
    return this.http.get<T>(`${environment.apiUrl}${target}`, { params: httpParams });
  }
  
  /** Post Request **/
  public sendPostRequest<T>(target: string, data: any): Observable<T> {
    return this.http.post<T>(environment.apiUrl + target, data);
  }
 
  /** Put Request **/
  public sendPutRequest<T>(target: string, id: number, data: any): Observable<T> {
    return this.http.put<T>(`${environment.apiUrl}${target}/${id}`, data);
  }
  
  /** Delete Request **/
  public sendDeleteRequest<T>(target: string, id: any): Observable<T> {
    return this.http.delete<T>(`${environment.apiUrl}${target}/${id}`);
  }
  
}

