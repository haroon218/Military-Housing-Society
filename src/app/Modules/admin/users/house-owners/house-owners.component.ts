import { CommonModule } from '@angular/common';
import { Component, signal, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
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
import { SharedService } from '../../Shared/services/shared.service';
import { TrigerToastService } from '../../Shared/services/triger-toast.service';
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
  selector: 'app-house-owners',
  imports: [
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
        ReactiveFormsModule
  ],
  templateUrl: './house-owners.component.html',
  styleUrl: './house-owners.component.scss'
})
export class HouseOwnersComponent {
  
  
  area:any=[]
    exportColumns!: ExportColumn[];
  
    cols!: Column[];
  ownerId:any
   ownerDialog = false;  
  ownerForm!: FormGroup;
  areas: any[] = [];
  blocks: any[] = [];
  plots: any[] = [];
loading:boolean=false
  constructor(
    private fb: FormBuilder,
    private sharedService: SharedService,private toastrService:TrigerToastService
  ) {}
 owners: any[] = [];
  ngOnInit() {
     this.ownerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', Validators.required],
      areaId: [null, Validators.required],
      blockId: [null, Validators.required],
      plotId: [null, Validators.required]
    });
this.loadOwners()
    this.loadAreas();



   
  }
  onAreaChange(event:any){
 debugger
      if ( event.value) {
        this.loadBlocks( event.value);
        this.ownerForm.patchValue({ blockId: null, plotId: null });
        this.blocks = [];
        this.plots = [];
      }
  
  }
  onBlockChange(event:any){
debugger
      if (event.value) {
        this.loadPlots(event.value);
        this.ownerForm.patchValue({ plotId: null });
        this.plots = [];
      }
    
  }
  loadOwners() {
   this.loading=true; 
      this.sharedService.sendGetRequest('/Owner/list').subscribe({
        next:(response :any)=>{    
          debugger   
          if(response && response.success){
            this.loading=false;
            this.owners=response.data;
          }else{
            this.loading=false;
          }
        },
        error:(error:any)=>{
           this.loading=false;
        }
      })
  }

  loadAreas() {
    this.sharedService.sendGetRequest('/Area/getAreas').subscribe((data:any) => {
         if(data && data.success){
           debugger
            this.areas=data.data;
          }
     
    });
  }

  loadBlocks(areaId: number) {
    this.sharedService.sendGetRequest(`/Area/${areaId}/blocks`).subscribe((data:any) => {
      debugger
      this.blocks = data;
      this.ownerForm.patchValue({ blockId: null, plotId: null });
    });
  }
loadBlocksEdit(areaId: number, preselectBlockId?: number, preselectPlotId?: number) {
  this.sharedService.sendGetRequest(`/Area/${areaId}/blocks`).subscribe((data: any) => {
    this.blocks = data;

    if (preselectBlockId) {
      this.ownerForm.patchValue({ blockId: preselectBlockId });
      if (preselectBlockId) {
        this.loadPlots(preselectBlockId, preselectPlotId);
      }
    }
  });
}
loadPlots(blockId: number, preselectPlotId?: number) {
  this.sharedService.sendGetRequest(`/Blocks/${blockId}/plots`).subscribe((data: any) => {
    this.plots = data;

    if (preselectPlotId) {
      this.ownerForm.patchValue({ plotId: preselectPlotId });
    }
  });
}

openUpdateDialog(owner: any) {
  this.ownerId=owner.id
  this.ownerDialog = true;
  this.ownerForm.patchValue({
    name: owner.name,
    email: owner.email,
    phoneNumber: owner.phoneNumber,
    areaId: owner.areaId,
    blockId: null,
    plotId: null
  });
  if (owner.areaId) {
    this.loadBlocks(owner.areaId);
    setTimeout(() => {
      this.ownerForm.patchValue({ blockId: owner.blockId });
      if (owner.blockId) {
        this.loadPlots(owner.blockId);
        setTimeout(() => {
          this.ownerForm.patchValue({ plotId: owner.plotId });
        }, 300);
      }
    }, 300);
  }
}

  saveOwner() {
    if (this.ownerForm.valid) {
        this.sharedService.sendPostRequest('/Owner',this.ownerForm.value).subscribe({
          next:(respose:any)=>{
            
            if(respose &&respose.success){
              this.toastrService.showToast({
                type: 'success',
                shortMessage: 'Success!',
                detail: respose.message,
              });
              this.ownerDialog=false;
              this.resetDialog()
              this.loadOwners();
            }else{
              this.toastrService.showToast({
                type: 'error',
                shortMessage: 'Error!',
                detail: respose.message,
              });
              this.ownerDialog=false;
            }
          },
          error:(error:any)=>{
    
          }
        })
      } else {
        this.ownerForm.markAllAsTouched();
        this.ownerForm.updateValueAndValidity();
      }
  }
  resetDialog(){
    this.ownerId=null
    this.ownerForm.reset()
  }
  updateOwner(){
     if (this.ownerForm.valid) {
        this.sharedService.sendPutRequest('/Owner/update',this.ownerId,this.ownerForm.value).subscribe({
          next:(respose:any)=>{        
            if(respose &&respose.success){
              this.toastrService.showToast({
                type: 'success',
                shortMessage: 'Success!',
                detail: respose.message,
              });
              this.ownerDialog=false;
              this.resetDialog()
              this.loadOwners();
            }else{
              this.toastrService.showToast({
                type: 'error',
                shortMessage: 'Error!',
                detail: respose.message,
              });
              this.ownerDialog=false;
            }
          },
          error:(error:any)=>{
    
          }
        })
      } else {
        this.ownerForm.markAllAsTouched();
        this.ownerForm.updateValueAndValidity();
      }
  }
}
  
  
