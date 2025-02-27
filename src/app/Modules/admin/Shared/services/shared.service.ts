import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../../../../environments/environments.dev';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  sharedData = new BehaviorSubject <any>({});
  public sharedData$: Observable<any> = this.sharedData.asObservable();
  constructor() { 
    this.getData()
  }
  public getData() {
    let storedData = localStorage.getItem('Data@Salvao');
    this.sharedData.next(JSON.parse(storedData || '{}'));
  }
}
