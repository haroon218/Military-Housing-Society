import { CommonModule } from '@angular/common';
import { Component, inject, signal, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MessageService, ConfirmationService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { RadioButtonModule } from 'primeng/radiobutton';
import { RatingModule } from 'primeng/rating';
import { RippleModule } from 'primeng/ripple';
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { TextareaModule } from 'primeng/textarea';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { RolePermissionService } from '../service/role-permission.service';
import { TrigerToastService } from '../../Shared/services/triger-toast.service';
import { SharedService } from '../../Shared/services/shared.service';
import { AdminRoutingModule } from "../../admin-routing.module";
interface Column {
  field: string;
  header: string;
  customExportHeader?: string;
}
export interface Role{
  id: number;
}
interface ExportColumn {
  title: string;
  dataKey: string;
}
@Component({
  selector: 'app-roles',
  imports: [
    ReactiveFormsModule,
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
    ConfirmDialogModule,
    CheckboxModule,
    AdminRoutingModule
],  templateUrl: './roles.component.html',
  styleUrl: './roles.component.scss',
  providers: [MessageService, ConfirmationService]
})
export class RolesComponent {
  private rolesService=inject(RolePermissionService);
  private sharedService=inject(SharedService)
  private toastrService=inject(TrigerToastService)
  allRoles:Role[]=[];
  loading:boolean=false;
  addRoleDialog:boolean = false;
  deleteDialog:boolean = false;
  is_update:boolean = false;
  updateItemData:any;
  deleteItem:any;
  RoleAry!:Role[]

  

  addRoleForm = new FormGroup({
    name:new FormControl("",[Validators.required])
  })

  constructor(){}
  ngOnInit(): void {
    this.getAllRoles()
  }
  getAllRoles(){
    this.loading=true;
    this.sharedService.sendGetRequest('/Role').subscribe({
      next:(respose:any)=>{ 
        if(respose&&respose.success){
          this.allRoles=respose.data;
          this.loading=false;
        }else{
          this.loading=false;
        }
      },
      error:(error:any)=>{
         this.loading=false;
      }
    })
  }
  addRole(){
    if (this.addRoleForm.valid) {
      this.rolesService.addRole(this.addRoleForm.value).subscribe({
        next:(respose:any)=>{
          
          if(respose&&respose.Success){
            this.toastrService.showToast({
              type: 'success',
              shortMessage: 'Success!',
              detail: respose.Message,
            });
            this.addRoleDialog=false;
            this.getAllRoles();
          }else{
            this.toastrService.showToast({
              type: 'error',
              shortMessage: 'Error!',
              detail: respose.Message,
            });
          }
        },
        error:(error:any)=>{
  
        }
      })
    } else {
      this.addRoleForm.markAllAsTouched();
      this.addRoleForm.updateValueAndValidity();
    }
  }

  updateRole(){
    if (this.addRoleForm.valid) {
      let payload={
        name:this.addRoleForm.value.name,
        role_id:this.updateItemData.id
      }
      this.rolesService.updateRole(payload).subscribe({
        next:(respose:any)=>{
          
          if(respose&&respose.Success){
            this.addRoleDialog=false;
            this.toastrService.showToast({
              type: 'success',
              shortMessage: 'Success!',
              detail: respose.Message,
            });
            this.getAllRoles();
            
          }else{
            this.toastrService.showToast({
              type: 'success',
              shortMessage: 'Success!',
              detail: respose.Message,
            });
            this.addRoleDialog=false
          }
        },
        error:(error:any)=>{
  
        }
      })
    } else {
      this.addRoleForm.markAllAsTouched();
      this.addRoleForm.updateValueAndValidity();
    }
  }
   
  openNew(){
    this.is_update=false;
    this.updateItemData=null;
    this.addRoleDialog = true ;
     this.addRoleForm.reset();
  }
  deleteSelectedProducts(){}
  editRole(data:any){
    this.updateItemData = data;
    this.is_update = true
    this.addRoleForm.patchValue(data);
    this.addRoleDialog  = true
  }
  deleteRole(data:any){
    this.deleteItem = data;
  }

  removeRole(){
    this.rolesService.deleterole(this.deleteItem.id).subscribe({
      next:(respose:any)=>{
        
        if(respose&&respose.Success){
          this.deleteDialog=false;
          this.toastrService.showToast({
            type: 'success',
            shortMessage: 'Success!',
            detail: respose.Message,
          });
          this.getAllRoles();
        }else{
         this.deleteDialog=false;
         this.toastrService.showToast({
          type: 'success',
          shortMessage: 'Success!',
          detail: respose.Message,
        });
        }
      },
      error:(error:any)=>{

      }
    })
  }

  //------------------------First Letter of all String Character Uppercase----------------
 captalizeStr(str:string){
   if (typeof str !== 'string' || !str.trim()) return ''; // Validate input
   return str.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  }


}