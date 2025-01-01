import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { ProgressBarModule } from 'primeng/progressbar';
import { Table, TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { AdminModule } from "../../../admin.module";
import { Router, RouterModule } from '@angular/router';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { MenuItem } from 'primeng/api';
import { SecureStorageService } from '../../../secure-storage.service';
import { AuthService } from '../../../../../services/auth.service';
import { TranslateModule } from '@ngx-translate/core';
import { UserManagementService } from '../../../../../services/user-management.service';
import { DialogModule } from 'primeng/dialog';
import { LocationService } from '../../../../../services/location.service';
import { EmployeeFormComponent } from '../employee-form/employee-form.component';
import { DomSanitizer } from '@angular/platform-browser';
import  NgxQRCodeModule  from '@techiediaries/ngx-qrcode';
import QRCode from 'qrcode';
import { ToastrService } from 'ngx-toastr';
import { CompaignsService } from '../../../../../services/compaigns.service';
@Component({
  selector: 'app-companies-list',
  standalone: true,
  imports: [TableModule, CommonModule, InputTextModule, TagModule, FormsModule,BreadcrumbModule,TranslateModule,EmployeeFormComponent,
    DropdownModule, MultiSelectModule, ProgressBarModule, ButtonModule, AdminModule,RouterModule,DialogModule,ReactiveFormsModule,CommonModule],
    templateUrl: './companies-list.component.html',
  styleUrl: './companies-list.component.css'
})
export class CompaniesListComponent {
  users:any
  isEditMode:boolean=false
  isLoading:boolean=false;
  loadingText:any
  employeeNameToDelete:any
  employeeIdToDelete:any
  delete:boolean=false
  showEmployeeFormDialog: boolean = false;
  selectedEmployee: any = null;
    customers: any[] = [];
    Cities:any[]=[]
    company_id:any
    loading: boolean = true;
    currentPage: number = 1;
    perPage: number = 10; // Adjust as needed
    totalRecords: number = 0; // Total records from API
    addCompanyForm!:FormGroup
    groups:any=[];
    selectedGroups:any
    display:boolean=false;
  constructor(private toastr:ToastrService,private sanitizer: DomSanitizer,private locationService:LocationService,private fb:FormBuilder,private companyService: AuthService,private storageService:SecureStorageService,private router:Router,private user_management_service:UserManagementService,private serice:CompaignsService) {}

  ngOnInit(): void {
    this.addCompanyForm = this.fb.group({
      name: ['', Validators.required], // Name field
      category: ['', [Validators.required]], // Mobile field (10 digits)
      cr_number: ['', [Validators.required]], // Email field
      city_id: ['',], // Address field
      website_url: ['', ], // Address field
      no_of_branches: ['',], // Address field
      group_id:[''],
      user_id:[''],
    });
    this.fetchGroups()
    this.loadCustomers();
    this.fetchCities();
    this.fetchUsers()
  }
  fetchUsers(): void {
    this.loading = true;

    const queryParams: any = {
        per_page: this.perPage,
        page: this.currentPage,
        role:'CompanyAdmin'  // Only add branch_id if defined
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
loadCustomers(): void {
  this.loading = true;

  const queryParams: any = {
    per_page: this.perPage,
    page: this.currentPage,
  };

  this.companyService.getCustomers(queryParams).subscribe({
    next: async (response: any) => {
      debugger
      // Map the API response to include QR codes
      this.customers = await Promise.all(
        response.data.data.map(async (customer: any) => {
          const encryptedId = this.storageService.encryptId(customer.id);
          const qrCodeUrl = this.generateCustomerUrl(encryptedId);
          const qrCodeImage = await this.generateQrCode(qrCodeUrl);
            return {
            ...customer,
            qrCode: qrCodeImage,
          };
        })
      );

      this.loading = false;
    },
    error: (error: any) => {
      console.error('Error fetching customers:', error);
      this.loading = false;
    },
  });
}
generateCustomerUrl(customerId: string): string {
  const baseUrl = 'https://rmr-user.vercel.app/register';
  return `${baseUrl}?id=${encodeURIComponent(customerId)}`;
}
// Generate QR code as a Data URL
async generateQrCode(url: string): Promise<string> {
  try {
    return await QRCode.toDataURL(url, { errorCorrectionLevel: 'H' });
  } catch (err) {
    return '';
  }
}




// Download QR Code as an image
downloadQrCode(customer: any): void {
  const link = document.createElement('a');
  link.href = customer.qrCode;
  link.download = `${customer.name}_QRCode.png`;
  link.click();
}





  navigateToViewList(id: string): void {
    // this.storageService.saveId(id);
    const encryptedId = this.storageService.encryptId(id);
    this.router.navigate(['admin/user-management/view-list',encryptedId]);
  }

  onPageChange(event: any): void {
    this.currentPage = event.page + 1; // PrimeNG uses 0-based indexing
    this.loadCustomers();
  }

  fetchGroups() {
    debugger
    this.user_management_service.getGroups().subscribe({
      next: (data) => {
        this.groups = data.data.data;
      },
      error: (error) => {
        console.error('Error fetching groups:', error);
      }
    });
  }
  fetchCities() {
    debugger
    this.locationService.getCities().subscribe({
      next: (data) => {
        debugger
        this.Cities = data.data.data;
      },
      error: (error) => {
        console.error('Error fetching groups:', error);
      }
    });
  }
  uploadedImage: any ={}
  images:any
  onImageUpload(event: any): void {
    const file = event.target.files[0];
    if (file) {
      // Store the uploaded file
      this.images = [file]; // Ensure only one image is stored
  
      // Generate a preview for the uploaded image
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.uploadedImage.url = e.target.result; // Store the Base64 image data
      };
      reader.readAsDataURL(file); // Read the file as a data URL
    }
  }
  

  removeImage(imageId: any, index?: number): void {
     // Optimistically update UI
    this.serice.deleteImages([imageId.id]).subscribe({
      next: () => {
        this.uploadedImage={}
        this.toastr.success('Image deleted successfully', 'Success');
      },
      error: (error) => {
        this.toastr.error('Failed to delete image', 'Error');
        console.error(error);
        // Roll back the change if API call fails
        // this.uploadedImage.splice(index, 0, removedImage[0]);
      },
    });
  }
  onSubmit(): void {
    if (this.isEditMode) {
      this.updateCompany();
  } else {
      this.addCompany();
  }
    // Step 1: Validate the form
    
  }
  addCompany(): void {
    if (this.addCompanyForm.valid) {
      // Create a FormData object
      const formData = new FormData();
  
      // Append form fields to FormData
      Object.keys(this.addCompanyForm.value).forEach((key) => {
        formData.append(key, this.addCompanyForm.value[key]);
      });
  
      // Append the image (if uploaded)
      if (this.images?.length > 0) {
        formData.append('logo', this.images[0]); // Append the first image as 'logo'
      }
  
      // Call the API to add the company
      this.isLoading = true; // Start loader
      this.loadingText = 'Processing...';
      this.companyService.addCompany(formData).subscribe({
        next: (response: any) => {
          this.isLoading = false; // Stop loader
          this.loadingText = '';
          this.display = false;
  
          // Reload customer list and reset the form
          this.loadCustomers();
          this.addCompanyForm.reset();
          this.images = []; // Clear uploaded images
        },
        error: (error: any) => {
          this.isLoading = false; // Stop loader
          this.loadingText = '';
          console.error('Error adding company:', error);
        },
      });
    }
  }
  updateCompany(): void {
    if (this.addCompanyForm.valid) {
      // Create a FormData object
      const formData = new FormData();
  
      // Append form fields to FormData
      Object.keys(this.addCompanyForm.value).forEach((key) => {
        formData.append(key, this.addCompanyForm.value[key]);
      });
  
      // Add `_method` key for update
      formData.append('_method', 'PUT');
  
      // Append the image (if uploaded)
      if (this.images?.length > 0) {
        formData.append('logo', this.images[0]); // Append the first image as 'logo'
      } 
  
      // Call the API to update the company
      this.isLoading = true; // Start loader
      this.loadingText = 'Updating...';
      this.companyService.updateCompany(this.company_id, formData).subscribe({
        next: (response: any) => {
          this.isLoading = false; // Stop loader
          this.loadingText = '';
          this.display = false; 
          this.isEditMode=false
          // Reload customer list and reset the form
          this.loadCustomers();
          this.addCompanyForm.reset();
          this.uploadedImage=null// Clear logo details
          this.images = []; // Clear uploaded images
        },
        error: (error: any) => {
          this.isLoading = false; // Stop loader
          this.loadingText = '';
          console.error('Error updating company:', error);
        },
      });
    }
  }
  
  openDialog(item: any = null) {
    if (item) {
      debugger
      this.company_id = item.id;
  debugger
      // If an item is passed, set edit mode and patch the form values
      this.isEditMode = true;
      this.addCompanyForm.patchValue(item)
       if(item.logo){
        this.uploadedImage = 
      
        {
          url: item.logo,
          id: item.logo_id,
        }
       }
    
        
    
    
    } else {
      // If no item is passed, set the form for adding a new giveaway
      this.isEditMode = false;
      this.addCompanyForm.reset();
    }
    this.display = true; // Show the dialog
  }
  onCancel() {
    this.addCompanyForm.reset();
    this.uploadedImage={}

    this.display = false;
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
      this.companyService.deleteCompany(this.employeeIdToDelete).subscribe({
        next: (response:any) => {
          this.toastr.success(response.message, 'Success');

          this.customers = this.customers.filter((group:any) => group.id !== this.employeeIdToDelete);
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
}
