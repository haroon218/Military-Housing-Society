import { Injectable } from '@angular/core';
import { Toast } from 'primeng/toast';
import { BehaviorSubject } from 'rxjs';
export interface ToastObj{
  type:string,
  shortMessage:string,
  detail:string
}
@Injectable({
  providedIn: 'root'
})
export class TrigerToastService {
  private showTaostMessage = new BehaviorSubject<ToastObj>({
    type: '', 
    shortMessage: '', 
    detail: ''
  });
    constructor() { }

  showToast(data:ToastObj){
    this.showTaostMessage.next(data);
  }

  getToastMessage(){
    return this.showTaostMessage.asObservable();
  }


}
