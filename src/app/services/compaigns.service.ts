import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Constants } from '../../../public/constants/constants';

@Injectable({
  providedIn: 'root'
})
export class CompaignsService {

  constructor(private http:HttpClient) { }
  getCompaigns(perPage?: number, page?: number, searchTerm?: string): Observable<any> {
    const url = `${Constants.baseApi}/campaigns`;
    let params = new HttpParams()
    // if (perPage !== null && perPage !== undefined) {
    //   params = params.set('per_page', perPage.toString());
    // }

    if (page !== null && page !== undefined) {
      params = params.set('page', page.toString());
    }

    if (searchTerm) {
      params = params.set('search', searchTerm);
    }
    return this.http.get<any>(url, { params });
  }

  deleteCompaign(groupId:any):Observable<any>{
   return this.http.delete<any>(`${Constants.baseApi}/campaigns/${groupId}`)
  }
  addCompaign(groupdata:any){
    return this.http.post<any>(`${Constants.baseApi}/campaigns`,groupdata)
  }
  addGiveawayOffer(groupdata:any){
    return this.http.post<any>(`${Constants.baseApi}/offers`,groupdata)
  }
  getGiveawayOffer(perPage?: number, page?: number, searchTerm?: string): Observable<any> {
    const url = `${Constants.baseApi}/offers`;
    let params = new HttpParams()
    // if (perPage !== null && perPage !== undefined) {
    //   params = params.set('per_page', perPage.toString());
    // }

    if (page !== null && page !== undefined) {
      params = params.set('page', page.toString());
    }

    if (searchTerm) {
      params = params.set('search', searchTerm);
    }
    return this.http.get<any>(url, { params });
  }
  updateOffer(promotionId:any,promotionData:FormData){
    return this.http.post<any>(`${Constants.baseApi}/offers/${promotionId}`, promotionData);

  }
  deleteoffer(groupId:any):Observable<any>{
    return this.http.delete<any>(`${Constants.baseApi}/offers/${groupId}`)
   }
   addReward(groupdata:any){
    return this.http.post<any>(`${Constants.baseApi}/rewards`,groupdata)
  }
  getRewards(perPage?: number, page?: number, searchTerm?: string): Observable<any> {
    const url = `${Constants.baseApi}/rewards`;
    let params = new HttpParams()
    // if (perPage !== null && perPage !== undefined) {
    //   params = params.set('per_page', perPage.toString());
    // }

    if (page !== null && page !== undefined) {
      params = params.set('page', page.toString());
    }

    if (searchTerm) {
      params = params.set('search', searchTerm);
    }
    return this.http.get<any>(url, { params });
  }
  updatereward(promotionId:any,promotionData:FormData){
    return this.http.post<any>(`${Constants.baseApi}/rewards/${promotionId}`, promotionData);

  }
  deleteReward(groupId:any):Observable<any>{
    return this.http.delete<any>(`${Constants.baseApi}/rewards/${groupId}`)
   }
  getCompaignsDetailById(groupId:any){
   return this.http.get<any>(`${Constants.baseApi}/campaigns/${groupId}`)
  }
 
  getpromotions(params?: { per_page?: number; page?: number; search?: string; no_campaigns?: any }): Observable<any> {
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
        if (params.no_campaigns) {
            httpParams = httpParams.set('no_campaigns', params.no_campaigns);
        }
    }

    return this.http.get<any>(`${Constants.baseApi}/promotions`, { params: httpParams });
}
  deletepromotions(groupId:any):Observable<any>{
   return this.http.delete<any>(`${Constants.baseApi}/promotions/${groupId}`)
  }
  addpromotions(groupdata:any){
    return this.http.post<any>(`${Constants.baseApi}/promotions`,groupdata)
  }
  updatePromotions(promotionId:any,promotionData:FormData){
    return this.http.post<any>(`${Constants.baseApi}/promotions/${promotionId}`, promotionData);

  }
  getpromotionsDetailById(groupId:any){
   return this.http.get<any>(`${Constants.baseApi}/promotions/${groupId}`)
  }
  getSurvey(params?: { per_page?: number; page?: number; search?: string}): Observable<any> {
    
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
       
    }

    return this.http.get<any>(`${Constants.baseApi}/surveys`, { params: httpParams });
  }

  deleteSurvey(groupId:any):Observable<any>{
   return this.http.delete<any>(`${Constants.baseApi}/surveys/${groupId}`)
  }
  addSurvey(groupdata:any){
    return this.http.post<any>(`${Constants.baseApi}/surveys`,groupdata)
  }
  getSurveyDetailById(groupId:any){
   return this.http.get<any>(`${Constants.baseApi}/surveys/${groupId}`)
  }
  updateSurvey(promotionId:any,promotionData:FormData){
    return this.http.post<any>(`${Constants.baseApi}/surveys/${promotionId}`, promotionData);

  }
  deleteImages(imageIds: number[]): Observable<any> {
    // Construct the data object with the required array format
    const data = {
      ids: imageIds, // Ensure this is an array
    };
  
    // Send the POST request with the data object
    return this.http.post<any>(`${Constants.baseApi}/delete-images`, data);
  }
  
}
