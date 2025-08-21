import { CommonModule } from '@angular/common';
import { Component, ElementRef, inject, signal, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
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
import { TrigerToastService } from '../../../admin/Shared/services/triger-toast.service';
import { TherapistDetailComponent } from '../../../admin/users/therapist-detail/therapist-detail.component';
import { SharedService } from '../service/shared.service';

@Component({
  selector: 'app-bill-view',
  imports: [
     RouterModule,
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
        IconFieldModule,
        // ConfirmDialogModule,
        CheckboxModule,
        TherapistDetailComponent
  ],
  templateUrl: './bill-view.component.html',
  styleUrl: './bill-view.component.scss'
})
export class BillViewComponent {
   view:boolean=false;
   @ViewChild('printContent', { static: false }) printContent!: ElementRef;
private sharedService=inject(SharedService)
private toastrService=inject(TrigerToastService)
    productDialog: boolean = false;
  bills:any=[]
    products = signal<any[]>([]);
  
    product!: any;
  
    selectedProducts!: any[] | null;
  
    submitted: boolean = false;
  
    statuses!: any[];
    pizza:any
  
    @ViewChild('dt') dt!: Table;
  
    exportColumns!: any[];
  
    cols!: any[];
  
    constructor(
       
    ) {}
  

    
  referenceNo:any
    exportCSV() {
        this.dt.exportCSV();
    }
  
    ngOnInit() {
      this.sharedService.sharedData$.subscribe((data:any)=>{
        this.referenceNo=data.owner.referenceNo      })
        this.loadBills();
    }
    loadBills() {
  
      this.sharedService.sendGetRequest('/Billing/owner',[this.referenceNo]).subscribe({
        next:(response :any)=>{    
          debugger   
          if(response && response.success){
           
            this.bills=response.data;
          }
        },
        error:(error:any)=>{
          
        }
      })
  }
getStatusLabel(status: number): string {
  debugger
  switch (status) {
    case 0:
      return 'Pending';
    case 1:
      return 'Paid';
    case 2:
      return 'Overdue';
    default:
      return 'Unknown';
  }
}
markPaid(bill: any) {
  this.sharedService.sendPostRequest(`/Billing/mark-paid/${bill.id}`,{}).subscribe({
    next: (respose:any) => {
         if(respose &&respose.success){
              this.toastrService.showToast({
                type: 'success',
                shortMessage: 'Success!',
                detail: respose.message,
              });
             this.loadBills()
            }else{
              this.toastrService.showToast({
                type: 'error',
                shortMessage: 'Error!',
                detail: respose.message,
              });
             
            }
    },
    error: (err) => {
      
    }
  });
}
selectedBill:any
printBill(billId: number) {
    debugger
    this.sharedService.sendGetRequest(`/Billing`,[billId]).subscribe({
      next: (res: any) => {
        this.selectedBill = res.data; // full bill from API
        this.showPrintView = true;
      },
      error: err => console.error('Error fetching bill:', err)
    });
  }
getSeverity(status: string): any {
  switch (status) {
    case 'Pending':
      return 'warn'; // Pending
    case 'Paid':
      return 'success'; // Paid
    case 'danger':
      return 'danger';  // Overdue
    default:
      return 'info';
  }
}

   
    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }
  
    openNew() {
        this.product = {};
        this.submitted = false;
        this.productDialog = true;
    }
  
    editProduct(product: any) {
        this.product = { ...product };
        this.productDialog = true;
    }
  
    deleteSelectedProducts() {
        // this.confirmationService.confirm({
        //     message: 'Are you sure you want to delete the selected products?',
        //     header: 'Confirm',
        //     icon: 'pi pi-exclamation-triangle',
        //     accept: () => {
        //         this.products.set(this.products().filter((val) => !this.selectedProducts?.includes(val)));
        //         this.selectedProducts = null;
        //         this.messageService.add({
        //             severity: 'success',
        //             summary: 'Successful',
        //             detail: 'Products Deleted',
        //             life: 3000
        //         });
        //     }
        // });
    }
  
    hideDialog() {
        this.productDialog = false;
        this.submitted = false;
    }
    showPrintView = false;

    // Function to trigger print view inside the child component
    openPrintView() {
      debugger
      this.showPrintView = true;
    }
  
    // Function to reset print view after printing
    closePrintView() {
      this.showPrintView = false;
    }
    deleteProduct(product: any) {
        // this.confirmationService.confirm({
        //     message: 'Are you sure you want to delete ' + product.name + '?',
        //     header: 'Confirm',
        //     icon: 'pi pi-exclamation-triangle',
        //     accept: () => {
        //         this.products.set(this.products().filter((val) => val.id !== product.id));
        //         this.product = {};
        //         this.messageService.add({
        //             severity: 'success',
        //             summary: 'Successful',
        //             detail: 'Product Deleted',
        //             life: 3000
        //         });
        //     }
        // });
    }
  
    findIndexById(id: string): number {
        let index = -1;
        for (let i = 0; i < this.products().length; i++) {
            if (this.products()[i].id === id) {
                index = i;
                break;
            }
        }
  
        return index;
    }
  
    createId(): string {
        let id = '';
        var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for (var i = 0; i < 5; i++) {
            id += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return id;
    }
  

    ngAfterViewInit() {
      // Ensure ViewChild is initialized
      setTimeout(() => {
          if (!this.printContent) {
              console.error('printContent is not available');
          }
      });
  }

    printView() {
        if (!this.printContent) return;

        const printContents = this.printContent.nativeElement.innerHTML;
        const popupWin = window.open('', '_blank', 'width=800,height=600');

        if (popupWin) {
            popupWin.document.open();
            popupWin.document.write(`
                <html>
                <head>
                    <title>Print Preview</title>
                    <style>
                        body { font-family: Arial, sans-serif; margin: 20px; }
                    </style>
                </head>
                <body onload="window.print();window.close()">
                    ${printContents}
                </body>
                </html>
            `);
            popupWin.document.close();
        }
    }

    saveProduct() {
        // this.submitted = true;
        // let _products = this.products();
        // if (this.product.name?.trim()) {
        //     if (this.product.id) {
        //         _products[this.findIndexById(this.product.id)] = this.product;
        //         this.products.set([..._products]);
        //         this.messageService.add({
        //             severity: 'success',
        //             summary: 'Successful',
        //             detail: 'Product Updated',
        //             life: 3000
        //         });
        //     } else {
        //         this.product.id = this.createId();
        //         this.product.image = 'product-placeholder.svg';
        //         this.messageService.add({
        //             severity: 'success',
        //             summary: 'Successful',
        //             detail: 'Product Created',
        //             life: 3000
        //         });
        //         this.products.set([..._products, this.product]);
        //     }
  
        //     this.productDialog = false;
        //     this.product = {};
        // }
    }
  }
  
  


