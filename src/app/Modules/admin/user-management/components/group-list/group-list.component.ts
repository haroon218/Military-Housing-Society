import { Component } from '@angular/core';
import { AuthService } from '../../../../../services/auth.service';
import { Router, RouterModule } from '@angular/router';
import { SecureStorageService } from '../../../secure-storage.service';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { ProgressBarModule } from 'primeng/progressbar';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { AdminModule } from '../../../admin.module';
import { DialogModule } from 'primeng/dialog';
import { UserManagementService } from '../../../../../services/user-management.service';
import { ToastrService } from 'ngx-toastr';
import { EmployeeFormComponent } from "../employee-form/employee-form.component";

@Component({
  selector: 'app-group-list',
  standalone: true,
  imports: [TableModule, CommonModule, InputTextModule, TagModule, FormsModule, BreadcrumbModule, MultiSelectModule,EmployeeFormComponent,
    DropdownModule, MultiSelectModule, ProgressBarModule, ButtonModule, AdminModule, RouterModule, DialogModule, ReactiveFormsModule, EmployeeFormComponent],
      templateUrl: './group-list.component.html',
  styleUrl: './group-list.component.css'
})
export class GroupListComponent {
  showEmployeeFormDialog: boolean = false;
  selectedEmployee: any = null;
  isLoading:boolean=false
  loadingText:string=''
  groups:any=[];
  regions: any[] = [];
  delete:boolean=false
  groupIdToDelete: number | null = null; // ID of the group to delete
  groupNameToDelete: string | null = null; // Name of the group to delete
  isDeleting: boolean = false;
  display = false;
  users:any=[]
    loading: boolean = true;
    currentPage: number = 1;
    perPage: number = 10; // Adjust as needed
    totalRecords: number = 0; // Total records from API
    addGroup!:FormGroup
  constructor(private authService:AuthService ,private toastr: ToastrService ,private user_management_service: UserManagementService,private storageService:SecureStorageService,private router:Router,private fb:FormBuilder) {}

  ngOnInit(): void {
    this.addGroup = this.fb.group({
      name: ['', Validators.required],
      cr_number: [''],
      business_category: ['',Validators.required ],
      region_id: [[], Validators.required],
      user_id: [[],],
      adminEmail: ['',],
    });
    this.fetchGroups();
    this.fetchRegions();
    this,this.loadEmployees()
  }
  loadEmployees(): void {
    this.loading = true;

    const queryParams: any = {
        per_page: this.perPage,
        page: this.currentPage,
        role: 'GroupAdmin'  // Only add branch_id if defined
    };

    this.authService.getEmployees(queryParams).subscribe({
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
  fetchRegions() {
    // Call your API to get regions (replace with your API URL)
    this.user_management_service.fetchRegions().subscribe({
      next: (data) => {
        debugger
        this.regions = data.data.data; // Assuming the API response is an array of region objects
      },
      error: (error) => {
        console.error('Failed to fetch regions', error);
      }
    });
  }

  openAddAdminDialog() {
    this.showEmployeeFormDialog = true;
    this.selectedEmployee = null;
  }

  handleDialogSave(employeeData: any) {
    this.loadEmployees()
    this.showEmployeeFormDialog = false;
  }
  navigateToViewList(id: string): any {
  const encryptedId = this.storageService.encryptId(id);
  this.router.navigate(['admin/user-management/group-information',encryptedId]);
  }
  openDialog() {
    this.display = true;
  }
  onCancel() {
    this.display = false;
    this.addGroup.reset();
  }
  onAddGroupSubmit() {
    if (this.addGroup.valid) {
      this.isLoading = true;
      this.loadingText = 'Processing..';
      this.user_management_service.addGroup(this.addGroup.value).subscribe({
        next: (response) => {
          this.isLoading = false;
          this.loadingText = '';
  
          if (response.success) {
            this.toastr.success('Group added Successfully', 'Success');
            this.fetchGroups();
            this.addGroup.reset();
            this.display = false;
          } else {
            if (response.data) {
              const validationErrors = response.data;
              for (const field in validationErrors) {
                if (validationErrors.hasOwnProperty(field)) {
                  const messages = validationErrors[field];
                  if (Array.isArray(messages)) {
                    messages.forEach((message) => {
                      this.toastr.error(message, 'Validation Error');
                    });
                  }
                }
              }
            } else if (response.message) {
              this.toastr.error(response.message, 'Error');
            } else {
              this.toastr.error('An unexpected error occurred.', 'Error');
            }
          }
        },
        error: (err) => {
          this.isLoading = false;
          this.loadingText = '';
          this.toastr.error('An error occurred while processing the request.', 'Error');
        },
        complete: () => {
        }
      });
    } 
  }
  
  
  
  onPageChange(event: any): void {
    this.currentPage = event.page + 1; // PrimeNG uses 0-based indexing
    // this.loadCustomers();
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
          this.loadingText = 'Deleting...';
          this.user_management_service.deleteGroup(this.groupIdToDelete).subscribe({
            next: (response) => {
if(response.success){
  this.toastr.success('Group deleted Successfully', 'Success');
  this.loadingText = '';

  this.groups = this.groups.filter((group:any) => group.id !== this.groupIdToDelete);
  this.totalRecords = this.groups.length;
  this.delete = false;
  this.isDeleting = false; // Stop loader
  this.groupIdToDelete = null;
  this.groupNameToDelete = null;
}
             
            },
            error: (error) => {
              console.error('Error deleting group:', error);
              this.isDeleting = false;
              this.loadingText = '';
              // Stop loader even if there's an error
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
      fetchGroups() {
        debugger
        this.loading=true;
        this.user_management_service.getGroups().subscribe({
          next: (data) => {
            this.groups = data.data.data;
            this.loading=false // Assuming your API response has a list of groups
          },
          error: (error) => {
            this.loading=false
            console.error('Error fetching groups:', error);
          }
        });
      }
}

