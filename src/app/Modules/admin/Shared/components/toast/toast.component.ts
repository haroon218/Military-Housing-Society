import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ToastObj, TrigerToastService } from '../../services/triger-toast.service';
import { BrowserModule } from '@angular/platform-browser';
import {RippleModule} from 'primeng/ripple';
@Component({
  selector: 'app-toast',
  imports: [RippleModule,ToastModule],
  templateUrl: './toast.component.html',
  styleUrl: './toast.component.scss',
  providers: [MessageService]
})
export class ToastComponent implements OnInit{
  constructor(private messageService: MessageService,private toastService: TrigerToastService) { }

  ngOnInit(): void {
    this.toastService.getToastMessage().subscribe((res:ToastObj) => {
      if(res && res.type && res.shortMessage){
        this.showToast(res.type,res.shortMessage,res.detail)
      }
    })
  }

  showToast(type:string,shortMess:string,detail:string) {
    this.messageService.add({ severity: type, summary: shortMess, detail: detail,closable:false});
  }

}
