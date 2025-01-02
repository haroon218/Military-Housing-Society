import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Constants } from '../../../public/constants/constants';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LocationService {
  constructor(private http: HttpClient) {}
  getRegions() {
    return this.http.get<any>(`${Constants.baseApi}/regions`);
  }
  addRegion(regionData: any): Observable<any> {
    return this.http.post<any>(`${Constants.baseApi}/regions`, regionData);
  }
  addCountry(countryData: any): Observable<any> {
    return this.http.post<any>(`${Constants.baseApi}/countries`, countryData);
  }
  updateCountry(countryId:any,countryData:any){
    const data={_method:'PUT',...countryData}
    return this.http.post<any>(`${Constants.baseApi}/countries/${countryId}`, data);

  }
  deleteCountry(countryId:any){
    return this.http.delete<any>(`${Constants.baseApi}/countries/${countryId}`)
  }
  getCountries(perPage?: any, regionId?: any): Observable<any> {
    let params = new HttpParams();

    if (perPage) {
      params = params.set('per_page', perPage.toString());
    }

    if (regionId) {
      params = params.set('region_id', regionId.toString());
    }

    return this.http.get<any>(`${Constants.baseApi}/countries`, { params });
  }


  addArea(areaData: any): Observable<any> {
    return this.http.post<any>(`${Constants.baseApi}/areas`, areaData);
  }
  deleteArea(areaId:any){
    return this.http.delete<any>(`${Constants.baseApi}/areas/${areaId}`)
  }
  deleteRole(areaId:any){
    return this.http.delete<any>(`${Constants.baseApi}/roles/${areaId}`)
  }
  updateArea(AreaId:any,countryData:any){
    const data={_method:'PUT',...countryData}
    return this.http.post<any>(`${Constants.baseApi}/areas/${AreaId}`, data);

  }
  getAreas(perPage?: any, country_id?: any): Observable<any> {
    let params = new HttpParams();

    if (perPage) {
      params = params.set('per_page', perPage.toString());
    }

    if (country_id) {
      params = params.set('country_id', country_id.toString());
    }

    return this.http.get<any>(`${Constants.baseApi}/areas`, { params });
  }
  addCity(cityData: any): Observable<any> {
    return this.http.post<any>(`${Constants.baseApi}/cities`, cityData);
  }
  deleteCity(areaId:any){
    return this.http.delete<any>(`${Constants.baseApi}/cities/${areaId}`)
  }
  updateCity(AreaId:any,countryData:any){
    const data={_method:'PUT',...countryData}
    return this.http.post<any>(`${Constants.baseApi}/cities/${AreaId}`, data);

  }
  getCities(perPage?: any, country_id?: any): Observable<any> {
    let params = new HttpParams();

    if (perPage) {
      params = params.set('per_page', perPage.toString());
    }

    if (country_id) {
      params = params.set('area_id', country_id.toString());
    }

    return this.http.get<any>(`${Constants.baseApi}/cities`, { params });
  }
}
