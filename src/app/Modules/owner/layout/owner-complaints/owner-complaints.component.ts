import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { RadioButtonModule } from 'primeng/radiobutton';
import { RatingModule } from 'primeng/rating';
import { RippleModule } from 'primeng/ripple';
import { SelectModule } from 'primeng/select';
import { TableModule, Table } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { TextareaModule } from 'primeng/textarea';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { SharedService } from '../../../admin/Shared/services/shared.service';
import { TrigerToastService } from '../../../admin/Shared/services/triger-toast.service';

@Component({
  selector: 'app-owner-complaints',
  imports: [RouterModule,
          CommonModule,
          TableModule,
          FormsModule,
          ButtonModule,
          RippleModule,
          ToastModule,
          ToolbarModule,
          RatingModule,
          InputTextModule,
          TextareaModule,
          SelectModule,
          RadioButtonModule,
          InputNumberModule,
          DialogModule,
          TagModule,
          InputIconModule,
          IconFieldModule,],
  templateUrl: './owner-complaints.component.html',
  styleUrl: './owner-complaints.component.scss'
})
export class OwnerComplaintsComponent {
private sharedService=inject(SharedService);
complaints:any=[];
status:any
ownerId:any
private toastrService=inject(TrigerToastService)
ngOnInit() {
  this.sharedService.sharedData$.subscribe((data)=>{
    debugger
    this.ownerId=data.userId
  })
  this.getComplaints();
}

getComplaints() {
  this.sharedService.sendGetRequest('/Complaints/my',[this.ownerId]).subscribe({
    next: (response: any) => {
      if (response.success) {
        this.complaints = response.data;
      } else {
        this.toastrService.showToast({
          type: 'error',
          shortMessage: 'Error!',
          detail: response.message
        });
      }
    },
    error: () => {
      this.toastrService.showToast({
        type: 'error',
        shortMessage: 'Error!',
        detail: 'Failed to fetch complaints.'
      });
    }
  });
}
statuses = [
  { label: 'Unresolved', value: 'Unresolved' },
  { label: 'In Progress', value: 'In Progress' },
  { label: 'Resolved', value: 'Resolved' }
];

changeStatus(complaint: any) {
  this.sharedService.sendPutRequestforComplaint(`/Complaints/${complaint.id}/status`, { status:this.status }).subscribe({
    next: (response: any) => {
      if (response.success) {
        this.toastrService.showToast({
          type: 'success',
          shortMessage: 'Updated!',
          detail: response.message
        });
        this.getComplaints()
      } else {
        this.toastrService.showToast({
          type: 'error',
          shortMessage: 'Error!',
          detail: response.message
        });
      }
    },
    error: () => {
      this.toastrService.showToast({
        type: 'error',
        shortMessage: 'Error!',
        detail: 'Failed to update complaint status.'
      });
    }
  });
}

  
    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }

  
   

  
    getSeverity(status: string) {
        switch (status) {
            case 'Resolved':
                return 'success';
            case 'In Progress':
                return 'warn';
            case 'Unresolved':
                return 'danger';
            default:
                return 'info';
        }
    }
   
   
  }
  
  



