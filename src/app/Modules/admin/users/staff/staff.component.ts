import { CommonModule } from '@angular/common';
import { Component, inject, signal, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
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
import { UserService } from '../service/user.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { TrigerToastService } from '../../Shared/services/triger-toast.service';
import { SharedService } from '../../Shared/services/shared.service';
interface Column {
  field: string;
  header: string;
  customExportHeader?: string;
}

interface ExportColumn {
  title: string;
  dataKey: string;
}
@Component({
  selector: 'app-staff',
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
        CheckboxModule,ReactiveFormsModule
  ],
  templateUrl: './staff.component.html',
  styleUrl: './staff.component.scss',
    providers: [MessageService, ConfirmationService]
  
})
export class StaffComponent {

  private toastrService=inject(TrigerToastService)
  staffData:any=[ {
    id: '1000',
    code: 'f230fh0g3',
    name: 'Rana',
    description: 'Ali is Admin',
    role: 'Admin',
    price: 65,
    email: 'test@gmail.com',
    quantity: 24,
    inventoryStatus: 'Rejected',
    rating: 5
},
{
  id: '1000',
  code: 'f230fh0g3',
  name: 'Haroon',
  description: 'Ali is Admin',
  role: 'Admin',
  price: 65,
  email: 'test@gmail.com',
  quantity: 24,
  inventoryStatus: 'Rejected',
  rating: 5
},{
  id: '1000',
  code: 'f230fh0g3',
  name: 'Ahmad',
  description: 'Ali is Admin',
  role: 'Admin',
  price: 65,
  email: 'test@gmail.com',
  quantity: 24,
  inventoryStatus: 'Accepted',
  rating: 5
},];
userDialog:boolean=false
 private fb=inject(FormBuilder)
private sharedService=inject(SharedService)
  productDialog: boolean = false;
  products = signal<any[]>([]);
  product!: any;
  selectedProducts!: any[] | null;
  submitted: boolean = false;
  statuses!: any[];
  pizza: any
  roles:any=[]
    users:any=[]
  @ViewChild('dt') dt!: Table;
  exportColumns!: ExportColumn[];
  cols!: Column[];
  dataAry: any = [];
  userForm!: FormGroup;
  userId:any
  constructor() { 
    // this.getTherapistsData()
  }
  ngOnInit() {
    this.initForm()
    this.getAllUsers()
    this.getAllRoles()
    this.loadDemoData()
  }
  initForm() {
    this.userForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      roleId: [null, Validators.required],
    });
  }
  loadDemoData() {
    this.products.set(this.staffData);
    
}
getAllRoles() {
  this.sharedService.sendGetRequest('/Role').subscribe({
    next: (response: any) => { 
      if (response && response.success) {
        this.roles = response.data.filter((role: any) => role.name !== 'Owner');
      }
    },
    error: (error: any) => {
    }
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
openUpdateDialog(user: any) {
  this.userId = user.id;
  this.userDialog = true;
  this.userForm.patchValue(user);

  // disable email so it cannot be changed
  this.userForm.get('email')?.disable();
}

  saveUser() {
    if (this.userForm.valid) {
        this.sharedService.sendPostRequest('/User',this.userForm.value).subscribe({
          next:(respose:any)=>{
            
            if(respose &&respose.success){
              this.toastrService.showToast({
                type: 'success',
                shortMessage: 'Success!',
                detail: respose.message,
              });
              this.userDialog=false;
              this.resetDialog()
              this.getAllUsers()
            ;
            }else{
              this.toastrService.showToast({
                type: 'error',
                shortMessage: 'Error!',
                detail: respose.message,
              });
              this.userDialog=false;
            }
          },
          error:(error:any)=>{
    
          }
        })
      } else {
        this.userForm.markAllAsTouched();
        this.userForm.updateValueAndValidity();
      }
  }
  updateUser(){
     if (this.userForm.valid) {
        this.sharedService.sendPutRequest('/User',this.userId,this.userForm.value).subscribe({
          next:(respose:any)=>{        
            if(respose &&respose.success){
              this.toastrService.showToast({
                type: 'success',
                shortMessage: 'Success!',
                detail: respose.message,
              });
              this.userDialog=false;
              this.resetDialog()
              this.getAllUsers();
            }else{
              this.toastrService.showToast({
                type: 'error',
                shortMessage: 'Error!',
                detail: respose.message,
              });
              this.userDialog=false;
            }
          },
          error:(error:any)=>{
    
          }
        })
      } else {
        this.userForm.markAllAsTouched();
        this.userForm.updateValueAndValidity();
      }
  }
    resetDialog(){
    this.userId=null
    this.userForm.reset()
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }
  openNew() {
     this.userId = null;
  this.userDialog = true;
  this.userForm.reset();

  // enable email for new user
  this.userForm.get('email')?.enable();
  }



  deleteUser(user_id:any) {   
     this.sharedService.sendDeleteRequest('/User',user_id).subscribe({
          next:(respose:any)=>{
            
            if(respose &&respose.success){
              this.toastrService.showToast({
                type: 'success',
                shortMessage: 'Success!',
                detail: respose.message,
              });
           
              this.getAllUsers()
            ;
            }else{
              this.toastrService.showToast({
                type: 'error',
                shortMessage: 'Error!',
                detail: respose.message,
              });
              this.userDialog=false;
            }
          },
          error:(error:any)=>{
    
          }
        })
  }

  hideDialog() {
    this.userDialog = false;
 this.resetDialog()
  }

  deleteProduct(product: any) {
    
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
  saveProduct() {
    this.submitted = true;
    let _products = this.products();
    if (this.product.name?.trim()) {
        if (this.product.id) {
            _products[this.findIndexById(this.product.id)] = this.product;
            this.products.set([..._products]);
            this.toastrService.showToast({
              type: 'success',
              shortMessage: 'Success!',
              detail: 'Successfully Updated',
            });
        } else {
            this.product.id = this.createId();
            this.product.image = 'product-placeholder.svg';
            this.toastrService.showToast({
              type: 'success',
              shortMessage: 'Success!',
              detail: 'Successfully Added',
            });
            this.products.set([..._products, this.product]);
        }

        this.productDialog = false;
        this.product = {};
    }
}
}



