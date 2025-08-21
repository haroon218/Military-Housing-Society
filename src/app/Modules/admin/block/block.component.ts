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
import { SelectModule } from 'primeng/select';
import { SkeletonModule } from 'primeng/skeleton';

@Component({
  selector: 'app-block',
  imports: [
     ToolbarModule,
        ButtonModule, 
        CommonModule,
        TableModule,
        InputIconModule,  
        IconFieldModule,   
        InputTextModule, 
        DialogModule,
        SkeletonModule,
        ReactiveFormsModule,SelectModule
  ],
  templateUrl: './block.component.html',
  styleUrl: './block.component.scss'
})
export class BlockComponent {
  error:any
  skeletonRows = Array(5).fill(0);
  totalRecords:any=20
  private sharedService=inject(SharedService)
  private toastrService=inject(TrigerToastService)
  allPermissions:any[]=[]
loading:boolean=false;
  selectedProducts:any;
    addRoleDialog:boolean = false;
    deleteDialog:boolean = false;
    is_update:boolean = false;
    updateItemData:any;
    deleteItem:any;
    blocks:any=[]
    blockForm = new FormGroup({
      name:new FormControl("",[Validators.required]),
      areaId:new FormControl("",[Validators.required])
    })
    areaList:any=[]
    constructor(){}
    ngOnInit(): void {
      this.getBlocks();
      this.getAreas()
    }
    getAreas(){
      this.loading=true;
  
      this.sharedService.sendGetRequest('/Area/getAreas').subscribe({
        next:(response:any)=>{
          
          if(response &&response.success){
            debugger
            this.areaList=response.data;
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
    getBlocks(){
      this.loading=true;
  
      this.sharedService.sendGetRequest('/Blocks/get-blocks').subscribe({
        next:(response:any)=>{
          
          if(response){
            this.blocks=response.data;
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
    addBlock(){
      if (this.blockForm.valid) {
        this.sharedService.sendPostRequest('/Blocks/add-block',this.blockForm.value).subscribe({
          next:(respose:any)=>{
            
            if(respose){
              this.toastrService.showToast({
                type: 'success',
                shortMessage: 'Success!',
                detail: respose.message,
              });
              this.addRoleDialog=false;
              this.getBlocks();
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
        this.blockForm.markAllAsTouched();
        this.blockForm.updateValueAndValidity();
      }
    }
  
    updatePermission(){
      if (this.blockForm.valid) {
        this.sharedService.sendPutRequest('/Blocks/update-block',this.updateItemData.id,this.blockForm.value).subscribe({
          next:(respose:any)=>{
            
            if(respose){
              this.addRoleDialog=false;
              this.is_update=false;
              this.toastrService.showToast({
                type: 'success',
                shortMessage: 'Success!',
                detail: respose.message,
              });
              this.getBlocks();
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
        this.blockForm.markAllAsTouched();
        this.blockForm.updateValueAndValidity();
      }
    }
     
    openNew(){this.addRoleDialog = true ; this.blockForm.reset()}
    deleteSelectedProducts(){}
    editProduct(data:any){
      this.updateItemData = data;
      this.is_update = true
      this.blockForm.patchValue(data)
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
      this.sharedService.sendDeleteRequest('/Blocks/delete-block',this.deleteItem.id).subscribe({
        next:(respose:any)=>{
          
          if(respose &&respose.success){
            this.deleteDialog=false;
            this.toastrService.showToast({
              type: 'success',
              shortMessage: 'Success!',
              detail: respose.message,
            });
            this.getBlocks();
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

