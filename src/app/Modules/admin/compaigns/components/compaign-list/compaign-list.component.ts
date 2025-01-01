import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { ProgressBarModule } from 'primeng/progressbar';
import { Table, TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { AdminModule } from '../../../admin.module';
import { CompaignsRoutingModule } from '../../compaigns-routing.module';
import { CompaignsService } from '../../../../../services/compaigns.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-compaign-list',
  standalone: true,
  imports: [TableModule, CommonModule, InputTextModule, TagModule, FormsModule,BreadcrumbModule,TagModule,
    DropdownModule, MultiSelectModule, ProgressBarModule, ButtonModule, AdminModule,RouterModule,DialogModule,ReactiveFormsModule],  templateUrl: './compaign-list.component.html',
  styleUrl: './compaign-list.component.css'
})
export class CompaignListComponent {
  currentPage: number = 1;
  perPage: number = 10; // Adjust as needed
  items: MenuItem[] | undefined;
  display:boolean=false
  delete:boolean=false
  groupIdToDelete: number | null = null; // ID of the group to delete
  groupNameToDelete: string | null = null; // Name of the group to delete
  isDeleting: boolean = false;
  giveawayForm!: FormGroup;
  fields = [
    { label: 'Label', name: 'field1' },
    { label: 'Label', name: 'field2' },
    { label: 'Label', name: 'field3' },
    { label: 'Label', name: 'field4' },
    { label: 'Label', name: 'field3' },
    { label: 'Label', name: 'field4' }
  ];
  rowFields = [
    [this.fields[0], this.fields[1]],
    [this.fields[2], this.fields[3]],
    [this.fields[4], this.fields[5]]
  
  ];
  home: MenuItem | undefined;
compaigns:any=[]


loading: boolean = false;



statuses!: any[];


activityValues: number[] = [0, 100];

searchValue: string | undefined;

constructor(private fb:FormBuilder,private service:CompaignsService,private toastr:ToastrService) {}

ngOnInit() {
  this.items = [{ icon: 'pi pi-home', route: '/installation' }, { label: 'Components' }, { label: 'Form' }, { label: 'InputText', route: '/inputtext' }];
  this.giveawayForm = this.fb.group({
    field1: ['', Validators.required],
    field2: ['', Validators.required],
    field3: ['', Validators.required],
    field4: ['', Validators.required]
  });
this.loadCompaigns()
    
}

clear(table: Table) {
    table.clear();
    this.searchValue = ''
}

viewDetail(event:any){
debugger
const detail =event.value
}
onAddGiveaway() {
  if (this.giveawayForm.valid) {
    console.log('Giveaway Form Data:', this.giveawayForm.value);
    this.display = false;
    this.giveawayForm.reset();
  }
}
openDialog() {
  this.display = true;
}
onCancel() {
  this.display = false;
  this.giveawayForm.reset();
}
getSeverity(status: any):any {
  switch (status) {
      case 'Completed':
          return 'success';
      case 'Draft':
          return 'warning';
      case 'canceled':
          return 'danger';
  }
}
loadCompaigns(): void {
  this.loading = true;
  debugger
  const queryParams: any = {
    per_page: this.perPage,
    page: this.currentPage,
};
  this.service.getCompaigns().subscribe({
    next: (response: any) => {
      debugger
      this.compaigns = response.data.data; 
      this.loading = false;
    },
    error: (error: any) => {
      console.error('Error fetching customers:', error);
      this.loading = false;
    },
  });
}
onDelete(id: number, name: string) {
  this.groupIdToDelete = id;
  this.groupNameToDelete = name;
  this.delete = true;
}

// Method to handle the confirmation of deletion
confirmDelete() {
  if (this.groupIdToDelete !== null) {
    this.isDeleting = true; // Start loader
    this.service.deleteCompaign(this.groupIdToDelete).subscribe({
      next: () => {
        this.toastr.success('Compaign deleted Successfully', 'Success');

        this.compaigns = this.compaigns.filter((group:any) => group.id !== this.groupIdToDelete);
        this.delete = false;
        this.isDeleting = false; // Stop loader
        this.groupIdToDelete = null;
        this.groupNameToDelete = null;
      },
      error: (error) => {
        console.error('Error deleting group:', error);
        this.isDeleting = false; // Stop loader even if there's an error
      }
    });
  }
}

// Method to handle the cancellation of deletion
onDeleteCancel() {
  this.delete = false;
  this.groupIdToDelete = null;
  this.groupNameToDelete = null;
}
}


