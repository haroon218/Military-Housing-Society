import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { RippleModule } from 'primeng/ripple';
import { SelectModule } from 'primeng/select';
import { SkeletonModule } from 'primeng/skeleton';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { TextareaModule } from 'primeng/textarea';
import { ToolbarModule } from 'primeng/toolbar';
import { SharedService } from '../Shared/services/shared.service';
import { TrigerToastService } from '../Shared/services/triger-toast.service';
import { CalendarModule } from 'primeng/calendar';
@Component({
  selector: 'app-payroll',
  imports: [
     SkeletonModule,
            ReactiveFormsModule,
            CommonModule,
            TableModule,
            ButtonModule,
            ToolbarModule,
            DialogModule,
            InputNumberModule,
            InputIconModule,
            InputTextModule,
            RippleModule,
            SelectModule,
            IconFieldModule,
            DropdownModule,
            FormsModule,
            TagModule,
            TextareaModule,
            CalendarModule
  ],
  templateUrl: './payroll.component.html',
  styleUrl: './payroll.component.scss'
})
export class PayrollComponent {

 deleteItem: any = {}
  deleteRoleDialogShow:boolean=false

private toastrService=inject(TrigerToastService)
  perPage: number = 20;
  totalRecords: number = 0
  currentPage: number = 1;
  payrollDialog = false;
  is_update = false;
  isLoading = false;
  originalOptions: any[] = [];
  deletedOptions: any[] = [];
  isViewMode: any
  currentEditId: any
  skeletonRows = Array(5).fill(0);
  private sharedService = inject(SharedService);;
  private router=inject(Router)
  private fb = inject(FormBuilder)
  faqData: any[] = [];
  dataLoading: boolean = false;
  error: any
  faqTypes = [
    { label: 'Client', value:'0' },
    { label: 'Therapist', value:'1'}
];
users:any=[]
statuses=[
  { label: 'Unpaid', value:'Unpaid' },
    { label: 'Paid', value:'Paid'}
]
status:any
  payrollForm!: FormGroup
  ngOnInit(): void {
   this.initForm();
   this.getAllUsers()
    this.getAllFaqs();
  }
  onContextChange(value: string) {
    this.router.navigate(['/admin/content/faqs/sorting'], {
      queryParams: { context: value }
    });
  }
  initForm(): void {
this.payrollForm = this.fb.group({
  userId: [null, Validators.required],
  amount: [0, [Validators.required, Validators.min(0)]],
  month: [new Date(), Validators.required],
  status: ['Unpaid', Validators.required] 
});
  }
   getAllUsers(){

    this.sharedService.sendGetRequest('/User').subscribe({
      next:(respose:any)=>{ 
        if(respose&&respose.success){
          this.users=respose.data;
         
        }
      },
      error:(error:any)=>{
       
      }
    })
  }
  getAllFaqs() {
    this.dataLoading = true;
    this.sharedService.sendGetRequest<any>('/Payroll/all',).subscribe({
      next: (response: any) => {
        if (response && response.success) {
          this.faqData = response.data
        }
      },
      error: (error: any) => {
    
        this.dataLoading = false
      },
      complete: () => {
        this.dataLoading = false;
      },
    }
    )
  }
  deleteRoleDialogData(data: any) {
    this.deleteItem = data;
}
  openpayrollDialog(questionData?: any, isView: boolean = false): void {
    this.resetpayrollForm();
    this.isViewMode = isView;
    if (questionData) {
      this.is_update = !isView;
      this.payrollForm.patchValue(questionData)
      this.currentEditId = questionData.id         
       this.payrollDialog = true;
    } else {
      this.is_update = false;
      this.payrollDialog = true;
    }
    if (isView) {
      this.payrollForm.disable();
    } else {
      this.payrollForm.enable();
    }
  }

 savefaq(): void {
  if (this.payrollForm.invalid) {
    this.payrollForm.markAllAsTouched();
    return;
  }

  this.isLoading = true;

  const formValue: any = { ...this.payrollForm.value };

  let request$;

  if (this.is_update && this.currentEditId) {
    formValue.id = this.currentEditId;
    request$ = this.sharedService.sendPutRequest<any>(
      `/Payroll/update`,this.currentEditId,
      formValue
    );
  } else {
    request$ = this.sharedService.sendPostRequest<any>('/Payroll/generate', formValue);
  }

  request$.subscribe({
    next: (response: any) => {
      if (response && response.success) {
        this.isLoading = false;
        this.payrollDialog = false;

        const updatedData = response.data;

        if (this.is_update && this.currentEditId) {
          // Update the existing item in faqData
          const index = this.faqData.findIndex(
            (item: any) => item.id === updatedData.id
          );
          if (index !== -1) this.faqData[index] = updatedData;
        } else {
          // Add new item to the list
          this.totalRecords += 1;
          this.faqData.unshift(updatedData);
        }

        this.toastrService.showToast({
          type: 'success',
          shortMessage: 'Success!',
          detail: response.message || 'Operation completed successfully.',
        });
      } else {
        this.toastrService.showToast({
          type: 'error',
          shortMessage: 'Error!',
          detail: response.message || 'Something went wrong.',
        });
      }
    },
    error: (error: any) => {
      this.isLoading = false;
      this.toastrService.showToast({
        type: 'error',
        shortMessage: 'Error!',
        detail: error?.message || 'Server error occurred.',
      });
    },
    complete: () => {
      this.isLoading = false;
    }
  });
}
getSeverity(status: string): any {
  switch (status) {
    case 'Unpaid':
      return 'warn'; // Pending
    case 'Paid':
      return 'success'; // Paid
   
    default:
      return 'info';
  }
}
changeStatus(complaint: any) {
  debugger

  debugger
  this.sharedService.sendPutRequestforComplaint(`/Payroll/mark-paid/${complaint.id}`, {}).subscribe({
    next: (response: any) => {
      if (response.success) {
        this.toastrService.showToast({
          type: 'success',
          shortMessage: 'Updated!',
          detail: response.message
        });
        this.getAllFaqs()
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
  deleteRole() {
      this.isLoading=true;
      this.sharedService.sendPostRequest<any>('/delete-faq',{faq_id:this.deleteItem.faq_id}).subscribe({
        next: (respose: any) => {
          if (respose && respose.Success) {
            this.faqData = this.faqData.filter(item => item.faq_id !== this.deleteItem.faq_id);
            this.totalRecords = Math.max(this.totalRecords - 1, 0);
          // if the Success is true, we will show a success message and close the dialog
            this.deleteRoleDialogShow = false;
            this.toastrService.showToast({
              type: 'success',
              shortMessage: 'Success!',
              detail: respose.Message,
            });
           // after the response from API, we will get the roles again to ensure the latest data after the update
          } else {
             // if the Success is false, we will show an error message
            this.toastrService.showToast({
              type: 'success',
              shortMessage: 'Success!',
              detail: respose.Message,
            });
          }
        },
        error: (error: any) => {
          this.isLoading=false;
        },
        complete:()=>{
          this.isLoading=false;
        }
      })
  }
  toggleStatus(status: any): void {
    const previousStatus = status.is_active;
    const newStatus = previousStatus === 1 ? 0 : 1;
    const payload = {
      faq_id: status.faq_id,
      question:status.question,
      answer:status.answer,
      is_active: newStatus,
      faq_user_type:status.faq_user_type
    };
    this.sharedService.sendPostRequest<any>('/add-edit-faq', payload).subscribe({
      next: (response: any) => {      
        if (response && response.Success) {
          this.isLoading = false;
          status.is_active = newStatus;
          this.toastrService.showToast({
            type: 'success',
            shortMessage: 'Success!',
            detail: response.Message,
          });
        } else {
          status.is_active = previousStatus;
          this.toastrService.showToast({
            type: 'error',
            shortMessage: 'Error!',
            detail: response.Message,
          });
        }
      },
      complete: () => {
      },
      error: (error: any) => {
        status.is_active = previousStatus;
      }
    })
  }
  closepayrollDialog(): void {
    this.payrollForm.reset(); 
    this.payrollDialog = false;
  }
  resetpayrollForm(): void {
    this.payrollForm.reset(); 
    this.currentEditId = null;
  }
  onPageChange(event: any) {
    const pageNumber = Math.floor(event.first / event.rows) + 1;
    this.currentPage = pageNumber ? pageNumber : 1;
    this.perPage = event.rows;
    this.getAllFaqs();
  }
}

