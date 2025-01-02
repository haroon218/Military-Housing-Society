import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MenuItem } from 'primeng/api';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { ProgressBarModule } from 'primeng/progressbar';
import { TableModule } from 'primeng/table';
import { TabViewModule } from 'primeng/tabview';
import { TagModule } from 'primeng/tag';
import { AuthService } from '../../../../../services/auth.service';
import { SecureStorageService } from '../../../secure-storage.service';

@Component({
  selector: 'app-coustomer-information',
  standalone: true,
  imports: [TabViewModule,ButtonModule,TableModule, CommonModule, InputTextModule, TagModule, FormsModule,BreadcrumbModule,
    DropdownModule, MultiSelectModule, ProgressBarModule,ReactiveFormsModule,CommonModule,DialogModule],  templateUrl: './coustomer-information.component.html',
  styleUrl: './coustomer-information.component.css'
})
export class CoustomerInformationComponent {

  items: MenuItem[] | undefined;
  display = false;
  delete:boolean=false
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
  task:any=false;
  home: MenuItem | undefined;
  giveAwayList:any=[
    {
      type:'National Day',
      date:'24-10-2024',
      null:'null',
      nullList:'null'
    }
  ]
  customersData: any[] = [
  {
    id: 1,
    name: 'Rana Haroon',
    company: { code: 'us', name: '03044372368' },
    representative: { name: 'John Doe', image: 'amyelsner.png' },
    customerName:'Haroon',
    balance: 1200.5,
    activity: 80,
    verified: true,
  },
  {
    id: 2,
    name: 'Rana Haroon',
    company: { code: 'us', name: '03044372368' },
    representative: { name: 'Jane Smith', image: 'annafali.png' },
    customerName:'Haroon',
    balance: 900.0,
    activity: 60,
    verified: false,
  },
  {
    id: 3,
    name: 'Rana Haroon',
    company: { code: 'us', name: '03044372368' },
    representative: { name: 'Pierre Dupont', image: 'bernardodominic.png' },
    customerName:'Haroon',
    balance: 4500.75,
    activity: 95,
    verified: true,
  },
  {
    id: 4,
    name: 'Rana Haroon',
    company: { code: 'us', name: '03044372368' },
    representative: { name: 'Hans Müller', image: 'elwinsharvill.png' },
    customerName:'Haroon',
    balance: 320.0,
    activity: 50,
    verified: false,
  },
  {
    id: 5,
    name: 'Rana Haroon',
    company: { code: 'us', name: '03044372368' },
    representative: { name: 'Yuki Yamamoto', image: 'ivanmagalhaes.png' },
    customerName:'Haroon',
    balance: 7800.25,
    activity: 70,
    verified: true,
  }
  ];
  
  companyId: string | null = null;
    loading: boolean = false;
    customers: any[] = [];
    currentPage: number = 1;
    perPage: number = 10; // Adjust as needed
    totalRecords: number = 0; 
    addCompanyForm:FormGroup = this.fb.group({
      name: ['', Validators.required], // Name field
      mobile: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]], // Mobile field (10 digits)
      email: ['', [Validators.required, Validators.email]], // Email field
      address: ['', Validators.required], // Address field
    });
    constructor(private secureStorageService: SecureStorageService,private fb:FormBuilder,private authservice:AuthService) {}
  
    ngOnInit(): void {
      this.giveawayForm = this.fb.group({
        field1: ['', Validators.required],
        field2: ['', Validators.required],
        field3: ['', Validators.required],
        field4: ['', Validators.required]
      });
      // this.companyId = this.secureStorageService.getId();
    }
  
    onSubmit(){
  
    }
    openDialog() {
      this.display = true;
    }
    onCancel() {
      this.display = false;
      this.task=false
      this.giveawayForm.reset();
    }
  addTask(){
this.task=true
  }
    onAddGiveaway() {
      if (this.giveawayForm.valid) {
        console.log('Giveaway Form Data:', this.giveawayForm.value);
        this.display = false;
        this.giveawayForm.reset();
      }
    }
   
    
    onPageChange(event: any): void {
      this.currentPage = event.page + 1; // PrimeNG uses 0-based indexing
    }
    ondelete(){
  this.delete=true
    }
    onDeleteCancel() {
      this.delete = false;
    }
  
  }
  
