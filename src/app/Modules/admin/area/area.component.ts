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
import { SharedService } from '../Shared/services/shared.service';
import { SkeletonModule } from 'primeng/skeleton';

@Component({
  selector: 'app-area',
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
                SkeletonModule
  ],
  templateUrl: './area.component.html',
  styleUrl: './area.component.scss'
})
export class AreaComponent {
  skeletonRows = Array(5).fill(0);
  selectedStatus:any
  error:any
  totalRecords:number=0
  perPage: number =20; 
  currentPage: number = 1;
area:any[]=[]
private sharedService=inject(SharedService)

  private toastrService=inject(TrigerToastService)
  allPermissions:any=[]
loading:boolean=false;
  selectedProducts:any;
    addRoleDialog:boolean = false;
    deleteDialog:boolean = false;
    is_update:boolean = false;
    updateItemData:any;
    deleteItem:any;
    areaForm = new FormGroup({
      name:new FormControl("",[Validators.required])
    })
  
    constructor(){}
    ngOnInit(): void {
      this.getAreas();
    }
    getAreas(){
      this.loading=true; 
      this.sharedService.sendGetRequest('/Area/getAreas').subscribe({
        next:(response :any)=>{    
          debugger   
          if(response && response.success){       
            this.area=response.data;
            this.totalRecords=this.area.length
          }
        },
        error:(error:any)=>{
           this.loading=false;
        },complete:()=>{
          this.loading=false
        }
      })
    }
    addPermission(){
      if (this.areaForm.valid) {
        this.sharedService.sendPostRequest('/Area/addArea',this.areaForm.value).subscribe({
          next:(respose:any)=>{
            
            if(respose &&respose.success){
              this.toastrService.showToast({
                type: 'success',
                shortMessage: 'Success!',
                detail: respose.message,
              });
              this.addRoleDialog=false;
              this.getAreas();
            }else{
              this.toastrService.showToast({
                type: 'error',
                shortMessage: 'Error!',
                detail: respose.message,
              });
              this.addRoleDialog=false;
            }
          },
          error:(error:any)=>{
    
          }
        })
      } else {
        this.areaForm.markAllAsTouched();
        this.areaForm.updateValueAndValidity();
      }
    }
  
    updatePermission(){
      if (this.areaForm.valid) {
        this.sharedService.sendPutRequest('/Area/update-Area',this.updateItemData.id,this.areaForm.value).subscribe({
          next:(respose:any)=>{
            
            if(respose){
              this.addRoleDialog=false;
              this.is_update=false;
              this.toastrService.showToast({
                type: 'success',
                shortMessage: 'Success!',
                detail: respose.message,
              });
              this.getAreas();
            }else{
             this.addRoleDialog=false;
             this.is_update=false
             this.toastrService.showToast({
              type: 'success',
              shortMessage: 'Success!',
              detail: respose.message,
            });
            }
          },
          error:(error:any)=>{
    
          }
        })
      } else {
        this.areaForm.markAllAsTouched();
        this.areaForm.updateValueAndValidity();
      }
    }
     
    openNew(){this.addRoleDialog = true ; this.areaForm.reset()}
    deleteSelectedProducts(){}
    editProduct(data:any){
      this.updateItemData = data;
      this.is_update = true
      this.areaForm.patchValue(data)
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
      this.sharedService.sendDeleteRequest('/Area/delete-Area',this.deleteItem.id).subscribe({
        next:(respose:any)=>{
          
          if(respose){
            this.deleteDialog=false;
            this.toastrService.showToast({
              type: 'success',
              shortMessage: 'Success!',
              detail: respose.message,
            });
            this.getAreas();
          }else{
           this.deleteDialog=false;
           this.toastrService.showToast({
            type: 'success',
            shortMessage: 'Success!',
            detail: respose.message,
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



