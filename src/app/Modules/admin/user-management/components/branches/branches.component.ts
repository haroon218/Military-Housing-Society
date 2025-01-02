import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
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
import { TranslateModule } from '@ngx-translate/core';
import { AdminModule } from '../../../admin.module';
import { ToastrService } from 'ngx-toastr';
import { EmployeeFormComponent } from '../employee-form/employee-form.component';

@Component({
  selector: 'app-branches',
  standalone: true,
  imports: [TableModule, CommonModule, InputTextModule, TagModule, FormsModule,BreadcrumbModule,TranslateModule,EmployeeFormComponent,
    DropdownModule, MultiSelectModule, ProgressBarModule, ButtonModule, AdminModule,RouterModule,DialogModule,ReactiveFormsModule], 
     templateUrl: './branches.component.html',
  styleUrl: './branches.component.css'
})
export class BranchesComponent {
  showEmployeeFormDialog: boolean = false;
  selectedEmployee: any = null;
  display:any=false
  companies:any;
  searchTerm:any
  selectedBranch:any;
  isLoading:boolean=false;
  loadingText:any
  employeeNameToDelete:any
  employeeIdToDelete:any
  delete:boolean=false
  selectedCompany:any
  Branches: any[] = [];
    loading: boolean = true;
    currentPage: number = 1;
    perPage: number = 10; // Adjust as needed
    totalRecords: number = 0; // Total records from API
    branchForm!: FormGroup;
    users:any

  constructor(private toastr:ToastrService,private fb:FormBuilder,private companyService: AuthService,private storageService:SecureStorageService,private router:Router) {}

  ngOnInit(): void {
    this.branchForm = this.fb.group({
      name: ['', Validators.required],
      telephone_no: ['',], // For numeric phone number
      address: ['', Validators.required],
      timings: ['', Validators.required],
      company_id: ['', Validators.required],
      user_id:[''],
    });
    this.loadBranches();
    this.loadCompanies()
  this.fetchUsers()  }
  loadCompanies(): void {
    debugger
    const queryParams: any = {
      per_page: this.perPage,
      page: this.currentPage,
  };
    this.companyService.getCustomers(queryParams).subscribe({
      next: (response: any) => {
        debugger
        this.companies = response.data.data; 
      },
      error: (error: any) => {
        console.error('Error fetching customers:', error);
      },
    });
  }
  openAddAdminDialog() {
    this.showEmployeeFormDialog = true;
    this.selectedEmployee = null;
  }
  
  handleDialogSave(employeeData: any) {
    debugger
    console.log('Saved employee:', employeeData);
    this.fetchUsers()
    this.showEmployeeFormDialog = false;
    // Implement save logic here
  }
  loadBranches(): void {
    this.loading = true;
    debugger
    const queryParams: any = {
      per_page: this.perPage,
      page: this.currentPage,
      search: this.searchTerm || undefined, // Only add search if not empty
      company_id: this.selectedCompany || undefined // Only add branch_id if defined
  };
    this.companyService.getBranches(queryParams).subscribe({
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

  navigateToViewList(id: string): void {
    // this.storageService.saveId(id);
    const encryptedId = this.storageService.encryptId(id);
    this.router.navigate(['admin/user-management/view-list',encryptedId]);
  }

  onPageChange(event: any): void {
    this.currentPage = event.page + 1; // PrimeNG uses 0-based indexing
    this.loadBranches();
  }
  onCancel(): void {
    this.display = false; // Close the dialog
    this.selectedEmployee = null; // Reset selectedEmployee
    this.branchForm.reset(); // Clear the form
  }
  addEmployee(): void {
    if (this.branchForm.invalid) return;
  
    if (this.selectedEmployee) {
      this.selectedEmployee['_method']='PUT'
      const updatedEmployee = { ...this.selectedEmployee, ...this.branchForm.value };
      // Call service to update the employee
      this.companyService.updateBranch(updatedEmployee).subscribe(
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
      const newEmployee = this.branchForm.value;
      // Call service to add the employee
      this.companyService.addBranch(newEmployee).subscribe(
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
  fetchUsers(): void {
    this.loading = true;

    const queryParams: any = {
        per_page: this.perPage,
        page: this.currentPage,
        role:'BranchAdmin'  // Only add branch_id if defined
    };

    this.companyService.getEmployees(queryParams).subscribe({
        next: (response: any) => {
            this.users = response.data.data;
            this.loading = false;
        },
        error: (error: any) => {
            console.error('Error fetching employees:', error);
            this.loading = false;
        },
    });
}
  openDialog() {
    this.display = true;
  }
  onDelete(id: number, name: string) {
    this.employeeIdToDelete = id;
    this.employeeNameToDelete = name;
    this.delete = true;
  }
  confirmDelete() {
    if (this.employeeIdToDelete !== null) {
      this.isLoading = true; // Start loader
      this.loadingText = 'Deleting...';
      this.companyService.deleteBranch(this.employeeIdToDelete).subscribe({
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
}
