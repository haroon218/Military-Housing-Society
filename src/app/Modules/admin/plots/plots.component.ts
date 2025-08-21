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
import { SharedService } from '../Shared/services/shared.service';
import { SelectModule } from 'primeng/select';
import { SkeletonModule } from 'primeng/skeleton';
import { InputNumberModule } from 'primeng/inputnumber';

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
             SkeletonModule,
             InputNumberModule,
             ReactiveFormsModule,SelectModule
  ],
  templateUrl: './plots.component.html',
  styleUrl: './plots.component.scss'
})
export class PlotsComponent {
  error:any
  skeletonRows = Array(5).fill(0);
  totalRecords:any=20
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
    plots:any[]=[]
    houseSizes:any=[]
    plotForm = new FormGroup({
      name:new FormControl("",[Validators.required]),
      blockId:new FormControl("",[Validators.required]),
        houseSizeId:new FormControl("",[Validators.required])
    })
    areaList:any=[]
    constructor(){}
    ngOnInit(): void {
      this.getPlots();
      this.getAreas();
      this.getPlotsSizes()
    }
    getAreas(){
      this.loading=true;
  
      this.sharedService.sendGetRequest('/Blocks/get-blocks').subscribe({
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
        getPlotsSizes(){
      this.loading=true;
  
      this.sharedService.sendGetRequest('/HouseSize').subscribe({
        next:(response:any)=>{          
          if(response &&response.success){
            this.houseSizes=response.data;
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
    getPlots(){
      this.loading=true;
      this.sharedService.sendGetRequest('/Plot/get-plots').subscribe({
        next:(response:any)=>{
          
          if(response){
            this.plots=response.data;
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
    addPlot(){
      if (this.plotForm.valid) {
        this.sharedService.sendPostRequest('/Plot/add-plot',this.plotForm.value).subscribe({
          next:(respose:any)=>{
            
            if(respose){
              this.toastrService.showToast({
                type: 'success',
                shortMessage: 'Success!',
                detail: respose.message,
              });
              this.addRoleDialog=false;
              this.getPlots();
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
        this.plotForm.markAllAsTouched();
        this.plotForm.updateValueAndValidity();
      }
    }
  
    updatePermission(){
      if (this.plotForm.valid) {
        this.sharedService.sendPutRequest('/Plot/update-plot',this.updateItemData.id,this.plotForm.value).subscribe({
          next:(respose:any)=>{
            
            if(respose){
              this.addRoleDialog=false;
              this.is_update=false;
              this.toastrService.showToast({
                type: 'success',
                shortMessage: 'Success!',
                detail: respose.message,
              });
              this.getPlots();
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
        this.plotForm.markAllAsTouched();
        this.plotForm.updateValueAndValidity();
      }
    }
     
    openNew(){this.addRoleDialog = true ; this.plotForm.reset()}
    deleteSelectedProducts(){}
    editProduct(data:any){
      this.updateItemData = data;
      this.is_update = true
      this.plotForm.patchValue(data)
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
      this.sharedService.sendDeleteRequest('/Plot/delete-plot',this.deleteItem.id).subscribe({
        next:(respose:any)=>{
          
          if(respose &&respose.success){
            this.deleteDialog=false;
            this.toastrService.showToast({
              type: 'success',
              shortMessage: 'Success!',
              detail: respose.message,
            });
            this.getPlots();
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

