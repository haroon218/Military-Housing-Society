import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { ProgressBarModule } from 'primeng/progressbar';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { AuthService } from '../../../../../services/auth.service';
import { AdminModule } from '../../../admin.module';
import { SecureStorageService } from '../../../secure-storage.service';
import { EmployeeFormComponent } from '../../../user-management/components/employee-form/employee-form.component';
import { CompaignsService } from '../../../../../services/compaigns.service';
import flatpickr from 'flatpickr';

@Component({
  selector: 'app-promotion-list',
  standalone: true,
  imports: [TableModule, CommonModule, InputTextModule, TagModule, FormsModule,BreadcrumbModule,TranslateModule,
    DropdownModule, MultiSelectModule, ProgressBarModule, ButtonModule, AdminModule,RouterModule,DialogModule,ReactiveFormsModule],  templateUrl: './promotion-list.component.html',
  styleUrl: './promotion-list.component.css'
})
export class PromotionListComponent {
  displayPromotionDialog: boolean = false;
  promotionName: string = '';
  isEditMode:boolean=false
  selectedTemplate: string = '';
  description: string = '';
  formattedStartDate!: string;
  formattedEndDate!: string;
  imageUrls: any[] = [];
  @ViewChild('datePicker', { static: false }) datePicker!: ElementRef;
  @ViewChild('timePicker', { static: false }) timePicker!: ElementRef;
  hasPromotions:any=0
  promotionId:any
  promotionForm!:FormGroup
  images: any[] = []; // Array to hold uploaded image URLs
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
  constructor(private toastr:ToastrService,private fb:FormBuilder,private companyService: AuthService,private storageService:SecureStorageService,private router:Router,private service:CompaignsService) {}

  ngOnInit(): void {
    this.branchForm = this.fb.group({
      name: ['', Validators.required],
      telephone_no: ['',], // For numeric phone number
      address: ['', Validators.required],
      timings: ['', Validators.required],
      company_id: ['', Validators.required],
      user_id:[''],
    });
    this.promotionForm = this.fb.group({
      name: ['',],
      campaign_id:[[]],
      has_campaign: [''],
      startEndDate: ['', ],
      startTime: ['', ],
      endTime: ['', ],
      images: [null],
      description: ['', ],
    });
    this.loadBranches();
    this.loadCompanies()
 }
 loadCompanies(): void {
  // Ensure perPage and currentPage have valid values
  const perPage = this.perPage || 10; // Default to 10 if perPage is undefined or null
  const currentPage = this.currentPage || 1; // Default to 1 if currentPage is undefined or null

  // Prepare query parameters
  const queryParams: any = {
    per_page: perPage, // Pass as a valid number
    page: currentPage,
  };

  // Call the service to fetch campaigns
  this.service.getCompaigns(queryParams).subscribe({
    next: (response: any) => {
      // Handle the response
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
      // per_page: this.perPage,
      page: this.currentPage,
      // search: this.searchTerm || undefined,
      // company_id: this.selectedCompany || undefined 
  };
    this.service.getpromotions(queryParams).subscribe({
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
    this.display = false;
    this.images=[]
    this.imageUrls=[]
    this.isEditMode=false // Close the dialog
    this.selectedEmployee = null; // Reset selectedEmployee
    this.promotionForm.reset(); // Clear the form
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
      this.service.deletepromotions(this.employeeIdToDelete).subscribe({
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
  ngAfterViewInit() {
    // Date Range Picker Initialization
    flatpickr(this.datePicker.nativeElement, {
      mode: 'range',
      dateFormat: 'd/m/y',
      altInput: true,
      altFormat: 'd/m/y',
      allowInput: true,
      onChange: (selectedDates: Date[]) => {
        if (selectedDates.length === 2) {
          // Format start and end dates
          this.formattedStartDate = this.formatDate(selectedDates[0]);
          this.formattedEndDate = this.formatDate(selectedDates[1]);
        
        }
      },
    });


  }
  addPromotion() {
    if (this.promotionForm.invalid) {
      this.promotionForm.markAllAsTouched();
      return;
    }
  
    // Create a new FormData object
    const formData = new FormData();
    const has_campaign = this.promotionForm.get('has_campaign')?.value || '0'; // Default to '0' if null/undefined
  
    // Append the text fields to FormData
    formData.append('name', this.promotionForm.value.name || '');
    formData.append('has_campaign', has_campaign);
    formData.append('start_date', this.formattedStartDate || '');
    formData.append('end_date', this.formattedEndDate || '');
    formData.append('start_time', this.formatTime(this.promotionForm.value.startTime || ''));
    formData.append('end_time', this.formatTime(this.promotionForm.value.endTime || ''));
    formData.append('description', this.promotionForm.value.description || '');
    formData.append('status', '1'); // Set status as needed
  
    // Append campaign_id only if has_campaign is '1'
    if (has_campaign === '1') {
      const campaign_id = this.promotionForm.value.campaign_id;
      if (campaign_id) {
        formData.append('campaign_id[]', campaign_id);
      }
    }
  
    // Append images to FormData
    this.images.forEach((image: File) => {
      formData.append('images[]', image, image.name);
    });
  
    // Send the FormData to the API using your service
    this.isLoading = true;
    this.loadingText = 'Processing..';
  
    this.service.addpromotions(formData).subscribe({
      next: (response) => {
        if (response.success) {
          // Success case
          this.toastr.success(response.message, 'Success');
          this.isLoading = false;
          this.loadingText = '';
          this.display = false;
          this.loadBranches(); // Reload data or refresh the view
          this.resetForm(); // Reset the form for future use
          this.images = [];
          this.imageUrls = [];
        } else {
          // Error case when `success` is false
          const errorMessage = response.message || 'Failed to submit promotion';
          this.toastr.error(errorMessage, 'Error');
          this.isLoading = false;
          this.loadingText = '';
        }
      },
      error: (error) => {
        // Handle HTTP or unexpected errors
        console.error('Failed to submit campaign', error);
        this.toastr.error(error.message || 'Failed to submit promotion', 'Error');
        this.isLoading = false;
        this.loadingText = '';
      },
    });
  }
  
  
  isFieldInvalid(field: string): any {
    const control = this.promotionForm.get(field);
    return control?.touched && control.invalid;
  }
 
  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  updatePromotionStatus(event: any) {
    this.hasPromotions = event.target.value === 'yes' ? 1 : 0;
    this.promotionForm.controls['hasPromotions'].setValue(this.hasPromotions);
  }

  onFileChange(event: any): void {
    const files = event.target.files;
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
  
      // Check file size (optional: 2MB max in this case)
      if (file.size <= 2 * 1024 * 1024) {
        // Store the file object in the images array for later use
        this.images.push(file);
  
        // Convert the file to a base64 URL for displaying the image
        const reader = new FileReader();
        reader.onload = (e: any) => {
          const imageUrl = e.target.result;
          if (!this.imageUrls.includes(imageUrl)) { // Prevent duplicates
            this.imageUrls.push(imageUrl); // Store base64 URL for displaying
          }
        };
        reader.readAsDataURL(file); // Read the file as Data URL
      } else {
        alert('File is too large! Please select a file smaller than 2MB.');
      }
    }
  }
  

  removeImage(imageId: number, index: number): void {
    const removedImage = this.imageUrls.splice(index, 1); // Optimistically update UI
    this.service.deleteImages([imageId]).subscribe({
      next: () => {
        this.toastr.success('Image deleted successfully', 'Success');
      },
      error: (error) => {
        this.toastr.error('Failed to delete image', 'Error');
        console.error(error);
        // Roll back the change if API call fails
        this.imageUrls.splice(index, 0, removedImage[0]);
      },
    });
  }
  
  onSubmit(): void {
    if (this.isEditMode) {
      this.updatePromotion();
  } else {
      this.addPromotion();
  }
    // Step 1: Validate the form
    
  }
  updatePromotion() {
    if (this.promotionForm.invalid) {
      this.promotionForm.markAllAsTouched();
      return;
    }
  
    // Step 1: Create a new FormData object
    const formData = new FormData();
  
    // Step 2: Get form values
    const has_campaign = this.promotionForm.get('has_campaign')?.value;
    const company_id = this.promotionForm.value.campaign_id;
    const formattedStartDate = this.formattedStartDate;
    const formattedEndDate = this.formattedEndDate;
    const startTime = this.formatTime(this.promotionForm.value.startTime);
    const endTime = this.formatTime(this.promotionForm.value.endTime);
  
    // Step 3: Append form fields (text data) to FormData
    formData.append('name', this.promotionForm.value.name);
    formData.append('has_campaign', has_campaign); // Convert to '1' or '0' if needed
    formData.append('start_date', formattedStartDate);
    formData.append('end_date', formattedEndDate);
    formData.append('start_time', startTime);
    formData.append('end_time', endTime);
    formData.append('description', this.promotionForm.value.description);
    if (has_campaign === '1') {
      const campaign_id = this.promotionForm.value.campaign_id;
      if (campaign_id) {
        formData.append('campaign_id[]', campaign_id);
      }
    }    formData.append('status', '1'); // Assuming '1' means active
  
    // Step 4: Append method (_method) to FormData (for simulating PUT)
    const method = this.isEditMode ? 'PUT' : 'POST';
    formData.append('_method', method);
  
    // Step 5: Append images to FormData (if any)
    this.images.forEach((image: File) => {
      formData.append('images[]', image, image.name); // Append the image file
    });
    this.isLoading = true;
    this.loadingText = 'Processing..';
    // Step 6: Send the FormData to the API
    this.service.updatePromotions(this.promotionId, formData).subscribe({
      next: (response) => {
        this.toastr.success(response.message, 'Success');
        console.log('Promotion updated successfully', response);
        this.isEditMode = false;
        this.display = false;
        this.isLoading = false;
        this.loadingText = '';
        this.loadBranches();
        this.resetForm();
        this.images = [];
        this.imageUrls=[]   // Clear images array
      },
      error: (error) => {
        this.toastr.error(error.message || 'Failed to update promotion', 'Error');
        this.isLoading = false;      },
    });
  }
  
  // Optional Helper Method to Reset Form
  private resetForm(): void {
    this.promotionForm.reset();
    this.images = [];
    this.hasPromotions = false;
  }
  

  formatTime(time: string): string {
    // Regular expression to check if the time is already in HH:mm:ss format
    const timePattern = /^\d{2}:\d{2}:\d{2}$/;
  
    // If the time is already in the correct format, return it as is
    if (timePattern.test(time)) {
      return time;
    }
  
    // Otherwise, convert it to the correct format by adding seconds
    const [hours, minutes] = time.split(':');
    return `${hours}:${minutes}:00`;
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
  openEditPromotion(promotion: any): void {
    debugger;
  
    // Set the selected promotion data to edit
    this.isEditMode = true; 
    this.promotionId = promotion.id;
  
    // Patch the form with the promotion data
    this.promotionForm.patchValue({
      name: promotion.name,
      campaign_id: promotion?.campaigns[0]?.id || [], // Default to an empty array
      has_campaign: promotion.has_campaign ? '1' : '0', // Ensure 'has_campaign' is patched
      startTime: promotion.start_time,
      endTime: promotion.end_time,
      description: promotion.description,
    });
  
    // Handle date range (start_date and end_date)
    const startDate = promotion.start_date ? new Date(promotion.start_date) : null;
    const endDate = promotion.end_date ? new Date(promotion.end_date) : null;
    this.formattedStartDate = promotion.start_date;
    this.formattedEndDate = promotion.end_date ;
    if (startDate && endDate) {
      // Manually set the value of flatpickr (it doesn't pick up the form control directly)
      flatpickr(this.datePicker.nativeElement, {
        mode: 'range',
        dateFormat: 'd/m/y', // Match the format you're using
        altInput: true,
        altFormat: 'd/m/y',
        allowInput: true,
        defaultDate: [startDate, endDate], // Set the date range
        onChange: (selectedDates: Date[]) => {
          if (selectedDates.length === 2) {
            this.formattedStartDate = this.formatDate(selectedDates[0]);
            this.formattedEndDate = this.formatDate(selectedDates[1]);
          }
        },
      });
    }
  
    // Handle images (if applicable)
    this.imageUrls = promotion.images || []; // Set the images array
    this.images = []; // Reset uploaded images (optional depending on your use case)
  
    // Show the dialog for editing
    this.display = true; 
  }
  


}
