import { Component } from '@angular/core';
import { SecureStorageService } from '../../../secure-storage.service';
import { TabViewModule } from 'primeng/tabview';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { ProgressBarModule } from 'primeng/progressbar';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { AuthService } from '../../../../../services/auth.service';
import { MenuItem } from 'primeng/api';
import { DialogModule } from 'primeng/dialog';
import { ActivatedRoute } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-company-information',
  standalone: true,
  imports: [TabViewModule,ButtonModule,TableModule, CommonModule, InputTextModule, TagModule, FormsModule,BreadcrumbModule,
    DropdownModule, MultiSelectModule, ProgressBarModule,ReactiveFormsModule,CommonModule,DialogModule,TranslateModule],
  templateUrl: './company-information.component.html',
  styleUrl: './company-information.component.css'
})
export class CompanyInformationComponent {
navigateToViewList(arg0: any) {
throw new Error('Method not implemented.');
}
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
employee:any
companyId: string | null = null;
  loading: boolean = false;
  customers: any[] = [];
  currentPage: number = 1;
  perPage: number = 10; // Adjust as needed
  totalRecords: number = 0; 
  addCompanyForm!:FormGroup 
  branchForm!:FormGroup
  Branches:any
  isLoading:boolean=false;
  loadingText:any
  employeeNameToDelete:any
  employeeIdToDelete:any
  selectedEmployee: any = null;

  constructor(private toastr:ToastrService,private route:ActivatedRoute ,private secureStorageService: SecureStorageService,private fb:FormBuilder,private authservice:AuthService) {}

  ngOnInit(): void {
    this.branchForm = this.fb.group({
      name: ['', Validators.required],
      telephone_no: ['',], // For numeric phone number
      address: ['', Validators.required],
      timings: ['', Validators.required],
      company_id: [''],
      user_id:[''],
    });
    this.giveawayForm = this.fb.group({
      field1: ['', Validators.required],
      field2: ['', Validators.required],
      field3: ['', Validators.required],
      field4: ['', Validators.required]
    });
    this.addCompanyForm = this.fb.group({
      name: ['', Validators.required], // Name field
      mobile: ['', [Validators.required]], // Mobile field (10 digits)
      email: ['', [Validators.required]], // Email field
      address: ['', Validators.required], // Address field
      group_id:[''],
      adminName:[''],
      adminEmail:['']
    });
    this.route.paramMap.subscribe(async (params) => {
      const encryptedId = params.get('id'); // Get the encrypted ID from the route
      if (encryptedId) {
        this.companyId =this.secureStorageService.decryptId(encryptedId)
      }
    })
    
    this.getCompanyInformation()
    this.loadBranches()
    this.loadCustomers(this.companyId)
  }

  onSubmit(){

  }

  onCancel() {
    this.display = false;
    this.employee=false
    this.giveawayForm.reset();
  }
  openDialogemployee(){
   this.employee=true
  }
  onAddGiveaway() {
    if (this.giveawayForm.valid) {
      console.log('Giveaway Form Data:', this.giveawayForm.value);
      this.display = false;
      this.giveawayForm.reset();
    }
  }
  loadBranches(): void {
    this.loading = true;
    debugger
    const queryParams: any = {
      per_page: this.perPage,
      page: this.currentPage,
      company_id: this.companyId || undefined 
  };
    this.authservice.getBranches(queryParams).subscribe({
      next: (response: any) => {
        debugger
        this.Branches = response.data.data; 
        this.loading = false;
      },
      error: (error: any) => {
        console.error('Error fetching customers:', error);
        this.loading = false;
      },
    });
  }
  getCompanyInformation(){
this.authservice.getCompanyInformation(this.companyId).subscribe({
  next:(response:any)=>{
debugger
console.log(response.data)
    this.addCompanyForm.patchValue(response.data);
    debugger
    this.authservice.companyId=response.data.id
  }
})
  }
  loadCustomers(CompanyId:any): void {
    this.loading = true;
    this.authservice.getBranches().subscribe({
    
      next: (response: any) => {
        debugger
        this.customers = response.data.data; 
        console.log(this.customers)
        this.loading = false;
      },
      error: (error: any) => {
        console.error('Error fetching customers:', error);
        this.loading = false;
      },
    });
  }
  onPageChange(event: any): void {
    this.currentPage = event.page + 1; // PrimeNG uses 0-based indexing
    this.loadCustomers(this.companyId);
  }
  openDialog() {
    this.display = true;
  }
  onDelete(id: number, name: string) {
    debugger
    this.employeeIdToDelete = id;
    this.employeeNameToDelete = name;
    this.delete = true;
  }
  confirmDelete() {
    if (this.employeeIdToDelete !== null) {
      this.isLoading = true; // Start loader
      this.loadingText = 'Deleting...';
      this.authservice.deleteBranch(this.employeeIdToDelete).subscribe({
        next: (response:any) => {
          this.toastr.success(response.message, 'Success');

          this.Branches = this.Branches.filter((group:any) => group.id !== this.employeeIdToDelete);
          // this.totalRecords = this.groups.length;
          this.delete = false;
          this.isLoading = false;
          this.loadingText = ''; // Stop loader
          this.employeeIdToDelete = null;
          this.employeeNameToDelete = null;
        },
        error: (error:any) => {
          this.loadingText = '';
          this.isLoading = false; // Stop loader even if there's an error
        }
      });
    }
  }

  // Method to handle the cancellation of deletion
  onDeleteCancel() {
    this.delete = false;
    this.employeeIdToDelete = null;
    this.employeeNameToDelete = null;
  }
  openEditDialog(employee: any): void {
    this.selectedEmployee = employee;
    debugger // Store the employee to edit
    this.branchForm.patchValue(employee);
    this.display = true; // Show the dialog
  }
  addEmployee(): void {
    if (this.branchForm.invalid) return;
  
    if (this.selectedEmployee) {
      this.selectedEmployee['_method']='PUT'
      const updatedEmployee = { ...this.selectedEmployee, ...this.branchForm.value };
      // Call service to update the employee
      this.authservice.updateBranch(updatedEmployee).subscribe(
        response => {
          this.toastr.success(response.message, 'Success');

          // Handle successful update
          this.loadBranches(); // Reload the employee list
          this.display = false; // Close the dialog
        },
        error => {
          console.error('Error updating employee:', error);
        }
      );
    } else {
      // Add mode
      this.branchForm.patchValue({
        company_id:this.companyId
      })
      const newEmployee = this.branchForm.value;
      // Call service to add the employee
      this.authservice.addBranch(newEmployee).subscribe(
        response => {
          this.toastr.success(response.message, 'Success');

          // Handle successful addition
          this.loadBranches(); // Reload the employee list
          this.display = false; // Close the dialog
        },
        error => {
          console.error('Error adding employee:', error);
        }
      );
    }
  }
}
