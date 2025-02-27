import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environments.dev';
import { LoginPayload, LoginResponse } from '../../../auth/components/login/login.component';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private http = inject(HttpClient);
  public getTherapists(): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/therapists`)
  }
  public addTherapist(payLoad: any): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/therapists`, payLoad)
  }
  public deleteTherapist(therapist_id: any): Observable<any> {
    return this.http.delete<any>(`${environment.apiUrl}/therapist/${therapist_id}`)
  }
  public updateTherapist(therapist_id: any, data: any): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/offers/${therapist_id}`, data);
  }
  public getTherapistDetail(therapist_id: any): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/therapist/${therapist_id}`)
  }
  public getPatients(): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/patients`)
  }
  public addPatient(payLoad: any): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/patients`, payLoad)
  }
  public deletePatient(patient_id: any): Observable<any> {
    return this.http.delete<any>(`${environment.apiUrl}/patient/${patient_id}`)
  }
  public updatPatient(patient_id: any, data: FormData): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/patient/${patient_id}`, data);
  }
}
