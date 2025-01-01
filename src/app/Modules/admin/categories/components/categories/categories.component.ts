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
import { Router, RouterModule } from '@angular/router';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { MenuItem } from 'primeng/api';
import { TranslateModule } from '@ngx-translate/core';
import { DialogModule } from 'primeng/dialog';
import { DomSanitizer } from '@angular/platform-browser';

import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../../../../services/auth.service';
import { AdminModule } from '../../../admin.module';
import { EmployeeFormComponent } from '../../../user-management/components/employee-form/employee-form.component';
import { CompaignsService } from '../../../../../services/compaigns.service';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [TableModule, CommonModule, InputTextModule, TagModule, FormsModule,BreadcrumbModule,TranslateModule,
    DropdownModule, MultiSelectModule, ProgressBarModule, ButtonModule, AdminModule,RouterModule,DialogModule,ReactiveFormsModule,CommonModule],  templateUrl: './categories.component.html',
  styleUrl: './categories.component.css'
})
export class CategoriesComponent {
  imageUrls: any[] = [];
images:any[]=[]
  users:any
  isLoading:boolean=false;
  loadingText:any
  employeeNameToDelete:any
  employeeIdToDelete:any
  delete:boolean=false
  showEmployeeFormDialog: boolean = false;
  selectedEmployee: any = null;
    customers: any[] = [];
    Cities:any[]=[]
    loading: boolean = true;
    currentPage: number = 1;
    perPage: number = 10; // Adjust as needed
    totalRecords: number = 0; // Total records from API
    addCompanyForm!:FormGroup
    groups:any=[];
    selectedGroups:any
    display:boolean=false;
  constructor(private service:CompaignsService,private toastr:ToastrService,private sanitizer: DomSanitizer,private fb:FormBuilder,private companyService: AuthService,private router:Router) {}

  ngOnInit(): void {
    this.addCompanyForm = this.fb.group({
      name: ['', Validators.required], // Name field
     
    });
    this.loadCustomers()
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

  this.companyService.getCategories(queryParams).subscribe({
    next: async (response: any) => {
      debugger
      // Map the API response to include QR codes
      this.customers = response.data.data

      this.loading = false;
    },
    error: (error: any) => {
      console.error('Error fetching customers:', error);
      this.loading = false;
    },
  });
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
    // this.router.navigate(['admin/user-management/view-list',encryptedId]);
  }

 

  onSubmit(): void {
    if (this.isEditMode) {
      this.updatecategory();
  } else {
      this.addcategory();
  }
    // Step 1: Validate the form
    
  }
  addcategory(){
    if (this.addCompanyForm.valid) {
      // Call the API to add the company
      const formData = new FormData();
      formData.append('name', this.addCompanyForm.value.name);
      this.images.forEach((image: File) => {
        formData.append('image', image, image.name);  // Ensure that 'image' is the correct field name expected by your API
      });
      this.isLoading = true;
  this.loadingText = 'Processing..';
      this.companyService.addCategory(formData).subscribe({
        next: (response: any) => {
          this.display = false;
          this.isEditMode = false;
          this.isLoading = false;
          this.loadingText = '';
          this.loadCustomers()
          // Navigate to the companies list
          // Reset the form after navigation
          this.addCompanyForm.reset();
        },
        error: (error: any) => {
        },
      });
    } 
  }
  updatecategory(){
    if (this.addCompanyForm.valid) {
      const formData = new FormData();
      formData.append('name', this.addCompanyForm.value.name);
      this.images.forEach((image: File) => {
        formData.append('image', image, image.name);  // Ensure that 'image' is the correct field name expected by your API
      });
      formData.append('_method', 'PUT');
     
      this.isLoading = true;
  this.loadingText = 'Processing..';
      // Call the API to add the company
      this.companyService.updateCategory(this.category_id,formData).subscribe({
        next: (response: any) => {
          this.isEditMode = false;
          this.display = false;
          this.isLoading = false;
          this.loadingText = '';
          this.loadCustomers()
          // Navigate to the companies list
          // Reset the form after navigation
          this.addCompanyForm.reset();
        },
        error: (error: any) => {
        },
      });
    } 
  }
  onSubmi(): void {
    debugger
   
  }
  isEditMode:boolean=false
  category_id:any
  openDialog(item: any = null): void {
    if (item) {
      this.category_id = item.id;
  
      // If an item is passed, set edit mode and patch the form values
      this.isEditMode = true;
      this.addCompanyForm.patchValue({
        name: item.name,
      });
  
      // Convert the single logo key to an array of objects with URL and logo_id
      this.imageUrls = item.logo
        ? [
            {
              url: item.logo,
              id: item.logo_id,
            },
          ]
        : []; // If no logo, set an empty array
  
      this.images = []; // Reset uploaded images (optional depending on your use case)
    } else {
      // If no item is passed, set the form for adding a new company
      this.isEditMode = false;
      this.addCompanyForm.reset();
      this.imageUrls = []; // Clear the image preview
      this.images = [];
    }
    this.display = true; // Show the dialog
  }
  
  onCancel() {
    this.display = false;
    this.addCompanyForm.reset();
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
      this.companyService.deleteCategory(this.employeeIdToDelete).subscribe({
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
  onFileChange(event: any): void {
    const files = event.target.files;
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
  
      if (file.size <= 2 * 1024 * 1024) { // 2MB size limit
        // Push the file into the images array for further use
        this.images.push(file);
  
        // Use FileReader to convert the file into base64 for image preview (optional)
        const reader = new FileReader();
        reader.onload = (e: any) => {
          const imageUrl = e.target.result;
          if (!this.imageUrls.includes(imageUrl)) {
            this.imageUrls.push(imageUrl); // Store base64 URL for displaying
          }
        };
        reader.readAsDataURL(file); // Read the file as base64 data URL for preview
      } else {
        alert('File is too large! Please select a file smaller than 2MB.');
      }
    }
  }
  removeImage(image: any, index?: any): void {
    debugger
    if (image.id ) {
      // Case when the image has an ID - call the API to remove it
      const removedImage = this.imageUrls.splice(index, 1)[0]; // Remove image optimistically
      this.images = this.images.filter(img => img !== removedImage);
  
      this.service.deleteImages([image.id]).subscribe({
        next: () => {
          this.toastr.success('Image deleted successfully', 'Success');
        },
        error: (error) => {
          this.toastr.error('Failed to delete image', 'Error');
          console.error(error);
          // If deletion fails, revert the UI state
          this.imageUrls.splice(index, 0, removedImage);
          this.images.push(removedImage);
        },
      });
    } else {
      // Case when the image does not have an ID - just remove from the array
      this.imageUrls = this.imageUrls.filter(img => img !== image);
      this.images = this.images.filter((img,indexs) => indexs !== index);
    }
  }
}

