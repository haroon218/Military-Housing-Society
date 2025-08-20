import { CommonModule } from '@angular/common';
import { Component, ElementRef, signal, ViewChild } from '@angular/core';
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
import { TherapistDetailComponent } from '../users/therapist-detail/therapist-detail.component';

@Component({
  selector: 'app-complaints',
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
  templateUrl: './complaints.component.html',
  styleUrl: './complaints.component.scss'
})
export class ComplaintsComponent {

 view:boolean=false;
   @ViewChild('printContent', { static: false }) printContent!: ElementRef;

    productDialog: boolean = false;
  
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
  
    dataAry:any = [  
    {
        id: '1000',
        name: 'Rana',
        category: 'Water Leakage',
        description: 'Water leakage in my bathroom',
        plot_no: 62,
        inventoryStatus: 'Unresolved ',
        due_amount:'2000',
        bill_date:'28 feb 2025',
        due_date:'30 feb 2025'

       
    },
      {
        id: '1001',
        name: 'Haroon',
        category: 'Electricity Outage',
         description: 'Outage for 10 hours',
        plot_no: 63,
        inventoryStatus: 'In Progress ',
        due_amount:'3000',
        bill_date:'28 feb 2025',
        due_date:'30 feb 2025'



    },
    {
      id: '1002',
      name: 'Ali',
      category: 'Electricity Outage',
      description: 'Electricity outage for lamost 3 hours ',
      plot_no: 64,
      inventoryStatus: 'Resolved ',
      due_amount:'4000',
      bill_date:'28 feb 2025',
      due_date:'30 feb 2025'


  },
  {
    id: '1003',
    name: 'Ahmad',
    category: 'Security',
    description: 'I have security issues in My block A',
    plot_no: 65,
    inventoryStatus: 'In Progress',
    due_amount:'1000',
    bill_date:'28 feb 2025',
due_date:'30 feb 2025'


},
    ]
  
    exportCSV() {
        this.dt.exportCSV();
    }
  
    ngOnInit() {
        this.loadDemoData();
    }
  
    loadDemoData() {
        this.products.set(this.dataAry);
        this.statuses = [
            { label: 'INSTOCK', value: 'instock' },
            { label: 'LOWSTOCK', value: 'lowstock' },
            { label: 'OUTOFSTOCK', value: 'outofstock' }
        ];
  
        this.cols = [
            { field: 'code', header: 'Code', customExportHeader: 'Product Code' },
            { field: 'name', header: 'Name' },
            { field: 'image', header: 'Image' },
            { field: 'price', header: 'Price' },
            { field: 'category', header: 'Category' }
        ];
  
        this.exportColumns = this.cols.map((col) => ({ title: col.header, dataKey: col.field }));
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
  
    getSeverity(status: string) {
        switch (status) {
            case 'paid':
                return 'success';
            case 'unpaid':
                return 'warn';
            case 'OUTOFSTOCK':
                return 'danger';
            default:
                return 'info';
        }
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
  
  


