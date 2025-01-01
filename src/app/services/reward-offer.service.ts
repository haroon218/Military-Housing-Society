import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Constants } from '../../../public/constants/constants';

@Injectable({
  providedIn: 'root'
})
export class RewardOfferService {

  constructor(private http:HttpClient) { }
  getRewards(perPage?: number, page?: number, searchTerm?: string): Observable<any> {
    const url = `${Constants.baseApi}/rewards`;
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

  deleteRewards(groupId:any):Observable<any>{
   return this.http.delete<any>(`${Constants.baseApi}/rewards/${groupId}`)
  }
  addReward(groupdata:any){
    return this.http.post<any>(`${Constants.baseApi}/rewards`,groupdata)
  }
  getRewardDetailById(groupId:any){
  return this.http.get<any>(`${Constants.baseApi}/rewards/${groupId}`)
  }
  getOffers(perPage?: number, page?: number, searchTerm?: string): Observable<any> {
    const url = `${Constants.baseApi}/offers`;
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

  deleteOffer(groupId:any):Observable<any>{
   return this.http.delete<any>(`${Constants.baseApi}/offers/${groupId}`)
  }
  addOffer(groupdata:any){
    return this.http.post<any>(`${Constants.baseApi}/offers`,groupdata)
  }
  getOffersDetailById(groupId:any){
  return this.http.get<any>(`${Constants.baseApi}/offers/${groupId}`)
  }
}
