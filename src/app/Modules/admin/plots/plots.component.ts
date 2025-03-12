import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { ToolbarModule } from 'primeng/toolbar';
import { RolePermissionService } from '../roles-permission/service/role-permission.service';
import { TrigerToastService } from '../Shared/services/triger-toast.service';
import { DropdownModule } from 'primeng/dropdown';

@Component({
  selector: 'app-plots',
  imports: [
     ToolbarModule,
            ButtonModule, 
            CommonModule,
            TableModule,
            InputIconModule,  
            IconFieldModule,   
            InputTextModule, 
            DialogModule,
            ReactiveFormsModule,
            DropdownModule
  ],
  templateUrl: './plots.component.html',
  styleUrl: './plots.component.scss'
})
export class PlotsComponent {

  blockList = [
    { id: 1, name: 'Block A' },
    { id: 2, name: 'Block B' },
    { id: 3, name: 'Block C' }
  ];
 private permissionService=inject(RolePermissionService);
  private toastrService=inject(TrigerToastService)
  allPermissions:any=[]
loading:boolean=false;
  selectedProducts:any;
    addRoleDialog:boolean = false;
    deleteDialog:boolean = false;
    is_update:boolean = false;
    updateItemData:any;
    deleteItem:any;
  
    
  
    addPermissionForm = new FormGroup({
      name:new FormControl("",[Validators.required])
    })
  
    constructor(){}
    ngOnInit(): void {
      // this.getPermissions();
    }
    getPermissions(){
      this.loading=true;
  
      this.permissionService.getPermissions().subscribe({
        next:(respose:any)=>{
          
          if(respose&&respose.Success){
            this.allPermissions=respose.Data;
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
    addPermission(){
      if (this.addPermissionForm.valid) {
        this.permissionService.addPermission(this.addPermissionForm.value).subscribe({
          next:(respose:any)=>{
            
            if(respose&&respose.Success){
              this.toastrService.showToast({
                type: 'success',
                shortMessage: 'Success!',
                detail: respose.Message,
              });
              this.addRoleDialog=false;
              this.getPermissions();
            }else{
              this.toastrService.showToast({
                type: 'error',
                shortMessage: 'Error!',
                detail: respose.Message,
              });
              this.addRoleDialog=false;
            }
          },
          error:(error:any)=>{
    
          }
        })
      } else {
        this.addPermissionForm.markAllAsTouched();
        this.addPermissionForm.updateValueAndValidity();
      }
    }
  
    updatePermission(){
      if (this.addPermissionForm.valid) {
        this.permissionService.updatPermission(this.updateItemData.id,this.addPermissionForm.value).subscribe({
          next:(respose:any)=>{
            
            if(respose&&respose.Success){
              this.addRoleDialog=false;
              this.is_update=false;
              this.toastrService.showToast({
                type: 'success',
                shortMessage: 'Success!',
                detail: respose.Message,
              });
              this.getPermissions();
            }else{
             this.addRoleDialog=false;
             this.is_update=false
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
      } else {
        this.addPermissionForm.markAllAsTouched();
        this.addPermissionForm.updateValueAndValidity();
      }
    }
     
    openNew(){this.addRoleDialog = true ; this.addPermissionForm.reset()}
    deleteSelectedProducts(){}
    editProduct(data:any){
      this.updateItemData = data;
      this.is_update = true
      this.addPermissionForm.patchValue(data)
      this.addRoleDialog  = true
    }
    deletePermission(data:any){
      this.deleteItem = data;
    }
    closeDialog(){
      this.is_update=false;
      this.addRoleDialog = false;
    }
    saveProduct(){}
  
    removeRole(){
      this.permissionService.deletePermission(this.deleteItem.id).subscribe({
        next:(respose:any)=>{
          
          if(respose&&respose.Success){
            this.deleteDialog=false;
            this.toastrService.showToast({
              type: 'success',
              shortMessage: 'Success!',
              detail: respose.Message,
            });
            this.getPermissions();
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

//-----------------------First Letter of a String Uppercase---------------
  FLS_Uppercase(str:string){
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

//------------------------First Letter of all String Character Uppercase----------------
 captalizeStr(str:string){
  if (typeof str !== 'string' || !str.trim()) return ''; // Validate input
  return str.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  }

}


