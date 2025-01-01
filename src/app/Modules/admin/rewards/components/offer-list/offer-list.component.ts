import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { ProgressBarModule } from 'primeng/progressbar';
import { Table, TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { AdminModule } from '../../../admin.module';
import { MenuItem } from 'primeng/api';
import { DialogModule } from 'primeng/dialog';
import { CompaignsService } from '../../../../../services/compaigns.service';
import { AuthService } from '../../../../../services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-offer-list',
  standalone: true,
  imports: [TableModule,DialogModule, CommonModule, InputTextModule, TagModule, FormsModule,BreadcrumbModule,
    DropdownModule, MultiSelectModule, ProgressBarModule, ButtonModule, AdminModule,RouterModule,ReactiveFormsModule],  templateUrl: './offer-list.component.html',
  styleUrl: './offer-list.component.css'
})
export class OfferListComponent {
  display:boolean=false
  giveawayForm!: FormGroup;
  isLoading:any=false
  items: MenuItem[] | undefined;
  home: MenuItem | undefined;
customers: any[] = [
  
];
employeeIdToDelete :any;
employeeNameToDelete : any;
delete :boolean=false;
images: any[] = []; // Array to hold uploaded image URLs
companies:any
loadingText:any

loading: boolean = false;

imageUrls: any[] = [];
isEditMode:boolean=false
offerId:any
statuses!: any[];
currentPage=1

activityValues: number[] = [0, 100];

searchValue: string | undefined;

constructor(private http:HttpClient,private toastr:ToastrService,private fb:FormBuilder,private service:CompaignsService,private companyService: AuthService) {}

ngOnInit() {
  this.items = [{ icon: 'pi pi-home', route: '/installation' }, { label: 'Components' }, { label: 'Form' }, { label: 'InputText', route: '/inputtext' }];
  this.giveawayForm = this.fb.group({
    name: ['', Validators.required],
    price: ['', Validators.required],
    description: ['', Validators.required],
    company_id:['',Validators.required],
    category_id:['',Validators.required]
  });
  this.loadCompanies()
    this.loadCustomers();
    this.loadCategories()
}
openDialog(item: any = null) {
  if (item) {
    debugger
    this.offerId = item.id;

    // If an item is passed, set edit mode and patch the form values
    this.isEditMode = true;
    this.giveawayForm.patchValue({
      name: item.name,
      price: item.price,
      description: item.description,
      company_id:item.company_id,
      category_id:item.category_id
    });
    this.imageUrls = item.images || []; // Set the images array
    this.images = []; // Reset uploaded images (optional depending on your use case)
  } else {
    // If no item is passed, set the form for adding a new giveaway
    this.isEditMode = false;
    this.giveawayForm.reset();
  }
  this.display = true; // Show the dialog
}
clear(table: Table) {
    table.clear();
    this.searchValue = ''
}

viewDetail(event:any){
debugger
const detail =event.value
}
sendOffer(customer: any): void {
  debugger
  const apiUrl = `https://ahmadmushtaq.com/misa-session-urdu/whatsapp/mass-send.php`;
  const params = {
    name: customer.description, // Replace with the correct field from your customer object
    mobile: `966599529572`, // Ensure correct formatting of the mobile number
    template: 'rmr_demo_jan_burger',
    button_var: customer.id // Replace with the correct field from your customer object
  };

  // Make API call
  this.http.get(apiUrl, { params }).subscribe({
    next: (response: any) => {
      // Success response
      console.log('API Response:', response);
      this.toastr.success('Offer sent successfully!');
    },
    error: (error: any) => {
      // Error response
      console.error('API Error:', error);
      this.toastr.error('Failed to send the offer. Please try again.');
    }
  });
}
users:any
loadusers(company_name:any){
  debugger
  const queryParams: any = {
    search:company_name
};
  this.companyService.getUsers(queryParams).subscribe({
    next: (response: any) => {
      debugger
      this.users = response.data.data; 

    },
    error: (error: any) => {

      console.error('Error fetching customers:', error);
    },
  });
}
onCancel() {
  this.display = false;
  this.giveawayForm.reset();
  this.imageUrls=[]
  this.images=[]
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

onAddGiveaway() {
  if (this.giveawayForm.invalid) {
    this.giveawayForm.markAllAsTouched();
    return;
  }

  // Prepare the form data to be sent to the API
  const formData = new FormData();
  formData.append('name', this.giveawayForm.value.name);
  formData.append('price', this.giveawayForm.value.price);
  formData.append('description', this.giveawayForm.value.description);
  formData.append('company_id', this.giveawayForm.value.company_id);
  formData.append('category_id', this.giveawayForm.value.category_id);

  // Append images to the formData
  this.images.forEach((image: File) => {
    formData.append('images[]', image, image.name);  // Ensure that 'image' is the correct field name expected by your API
  });
  this.isLoading = true;
  this.loadingText = 'Processing..';
  // Call the API to add the giveaway offer
  this.addGiveawayOffer(formData);
}
updateOffer() {
  if (this.giveawayForm.invalid) {
    this.giveawayForm.markAllAsTouched();
    return;
  }

  // Step 1: Create a new FormData object
  const formData = new FormData();

  // Step 2: Get form values
 

  formData.append('name', this.giveawayForm.value.name);
  formData.append('price', this.giveawayForm.value.price);
  formData.append('description', this.giveawayForm.value.description);
  formData.append('company_id', this.giveawayForm.value.company_id);
  formData.append('category_id', this.giveawayForm.value.category_id);

  formData.append('_method', 'PUT');
  // Append images to the formData
  this.images.forEach((image: File) => {
    formData.append('images[]', image, image.name);  // Ensure that 'image' is the correct field name expected by your API
  });
  this.isLoading = true;
  this.loadingText = 'Processing..';
  // Step 6: Send the FormData to the API
  this.service.updateOffer(this.offerId, formData).subscribe({
    next: (response) => {
      this.toastr.success(response.message, 'Success');
      this.isEditMode = false;
      this.display = false;
      this.isLoading = false;
      this.loadingText = '';
      this.giveawayForm.reset();
      this.loadCompanies()
      this.images = [];
      this.imageUrls=[]   // Clear images array
    },
    error: (error) => {
      this.toastr.error(error.message || 'Failed to update promotion', 'Error');
      this.isLoading = false;      },
  });
}
loadCompanies(): void {
  const queryParams: any = {
    // per_page: this.perPage,
    page: this.currentPage,
};
this.loading=true
  this.service.getGiveawayOffer(queryParams).subscribe({
    next: (response: any) => {
      debugger
      this.loading=false

      this.customers = response.data.data; 
    },
    error: (error: any) => {
      this.loading=false

      console.error('Error fetching customers:', error);
    },
  });
}
categories:any
loadCategories(): void {
  this.loading = true;

  const queryParams: any = {
    
  };

  this.companyService.getCategories(queryParams).subscribe({
    next: async (response: any) => {
      debugger
      // Map the API response to include QR codes
      this.categories = response.data.data

    },
    error: (error: any) => {
      console.error('Error fetching customers:', error);
      this.loading = false;
    },
  });
}
// Call the API (example method, replace with your actual service)
addGiveawayOffer(formData: FormData) {
  this.service.addGiveawayOffer(formData).subscribe({
    next: (response) => {
      this.display = false;
      this.isLoading = false;
      this.loadingText = '';
      this.giveawayForm.reset();
      this.imageUrls = [];
      this.images=[]
      this.loadCompanies()

    },
    error: (error) => {
      console.error('Error adding offer:', error);
    },
    complete: () => {
      this.loading = false;
    }
  });
}
loadCustomers(): void {
  debugger
  const queryParams: any = {
  
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
onSubmit(): void {
  if (this.isEditMode) {
    this.updateOffer();
} else {
    this.onAddGiveaway();
}
  // Step 1: Validate the form
  
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
    this.service.deleteoffer(this.employeeIdToDelete).subscribe({
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


