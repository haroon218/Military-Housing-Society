import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import flatpickr from 'flatpickr';
import { CalendarModule } from 'primeng/calendar';
import { DialogModule } from 'primeng/dialog';
import { CompaignsService } from '../../../../../services/compaigns.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { DropdownModule } from 'primeng/dropdown';
import { MultiSelectModule } from 'primeng/multiselect';
import { AuthService } from '../../../../../services/auth.service';

@Component({
  selector: 'app-add-compaign',
  standalone: true,
  imports: [CommonModule,DialogModule,FormsModule,ReactiveFormsModule,DropdownModule,MultiSelectModule],
  templateUrl: './add-compaign.component.html',
  styleUrl: './add-compaign.component.css'
})
export class AddCompaignComponent {
  promotions:any
  isLoading:boolean=false;
  loadingText:any
  displayPromotionDialog: boolean = false;
  promotionName: string = '';
  selectedTemplate: string = '';
  description: string = '';
  formattedStartDatePromotion!:string
  formattedEndDatePromotion!: string;

  formattedStartDate!: string;
  formattedEndDate!: string;
  imageUrls: any[] = [];
  imageUrlsPromotion: any[] = [];
  @ViewChild('datePickerPromotion', { static: false }) datePickerPromotion!: ElementRef;

  @ViewChild('datePicker', { static: false }) datePicker!: ElementRef;
  @ViewChild('timePicker', { static: false }) timePicker!: ElementRef;
  hasPromotions:any=0
  campaignForm!:FormGroup;
  promotionForm!:FormGroup;
  images: any[] = [];
  imagesPromotion:any[]=[] // Array to hold uploaded image URLs
  companies:any
  constructor(private fb: FormBuilder,private compaignService:CompaignsService,private toastr:ToastrService,private router:Router,private companyService: AuthService) {}

  ngOnInit(): void {
    this.campaignForm = this.fb.group({
      name: ['',],
      hasPromotions: [''],
      startEndDate: ['',],
      startTime: ['', ],
      endTime: ['', ],
      images: [null],
      company_id:[''],
      promotion_id:[[]],
      description: ['', ],
    });
    this.promotionForm = this.fb.group({
      name: ['',],
      campaign_id:[[]],
      has_campaign: [''],
      startEndDate: ['', ],
      startTime: ['', ],
      endTime: ['', ],
      imagesPromotion: [null],
      description: ['', ],
    });
    this.loadCustomers()
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
    flatpickr(this.datePickerPromotion.nativeElement, {
      mode: 'range',
      dateFormat: 'd/m/y',
      altInput: true,
      altFormat: 'd/m/y',
      allowInput: true,
      onChange: (selectedDates: Date[]) => {
        if (selectedDates.length === 2) {
          // Format start and end dates
          this.formattedStartDatePromotion = this.formatDate(selectedDates[0]);
          this.formattedEndDatePromotion = this.formatDate(selectedDates[1]);
        
        }
      },
    });

  }
  addPromotion(){

  }
  isFieldInvalid(field: string): any {
    const control = this.campaignForm.get(field);
    return control?.touched && control.invalid;
  }
 
  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  updatePromotionStatus(event: any) {
    debugger
    this.hasPromotions = event.target.value === 'yes' ? 1 : 0;
    this.campaignForm.controls['hasPromotions'].setValue(this.hasPromotions);
    this.getPromotions()
  }
  getPromotions() {
    const queryParams: any = {
      no_campaigns: 'true' // Specify the parameter as required
    };
    
    // Pass the parameter directly to getCompaigns
    this.compaignService.getpromotions(queryParams).subscribe({
      next: (response: any) => {
        this.promotions = response.data.data;
      },
      error: (error: any) => {
        console.error('Error fetching promotions:', error);
      }
    });
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
  onFileChangePromotion(event: any): void {
    const files = event.target.files;
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
  
      // Check file size (optional: 2MB max in this case)
      if (file.size <= 2 * 1024 * 1024) {
        // Store the file object in the images array for later use
        this.imagesPromotion.push(file);
  
        // Convert the file to a base64 URL for displaying the image
        const reader = new FileReader();
        reader.onload = (e: any) => {
          const imageUrl = e.target.result;
          if (!this.imageUrlsPromotion.includes(imageUrl)) { // Prevent duplicates
            this.imageUrlsPromotion.push(imageUrl); // Store base64 URL for displaying
          }
        };
        reader.readAsDataURL(file); // Read the file as Data URL
      } else {
        alert('File is too large! Please select a file smaller than 2MB.');
      }
    }
  }

  removeImage(image: string) {
    this.images = this.images.filter((img) => img !== image); // Remove the selected image from the array
    // Alternatively, you could also check by comparing URL and ensuring it's exactly the same format
  }

  onSubmit(): void {
    // Step 1: Validate the form
    if (this.campaignForm.invalid) {
      this.campaignForm.markAllAsTouched();
      return;
    }
  
    // Step 2: Create a new FormData object
    const formData = new FormData();
  
    // Step 3: Prepare promotion_id as an array
    let promotionid = this.campaignForm.value.promotion_id;
    let promotionids = Array.isArray(promotionid) ? promotionid : [promotionid]; // Ensure it's an array
  
    // Step 4: Append the text fields to FormData
    formData.append('name', this.campaignForm.value.name);
    formData.append('company_id', this.campaignForm.value.company_id);

    formData.append('has_promotions', this.hasPromotions); // Convert to '1' or '0'
    formData.append('start_date', this.formattedStartDate);
    formData.append('end_date', this.formattedEndDate);
    formData.append('start_time', this.formatTime(this.campaignForm.value.startTime));
    formData.append('end_time', this.formatTime(this.campaignForm.value.endTime));
    formData.append('description', this.campaignForm.value.description);
    formData.append('status', '1'); // Convert to '1' or '0'
  
    // Step 5: Append `promotion_id` as an array
    promotionids.forEach((id: any) => {
      formData.append('promotion_id[]', id); // Explicitly use the [] notation for arrays
    });
  
    // Step 6: Append images to FormData (if there are any)
    this.images.forEach((image: File) => {
      formData.append('images[]', image, image.name); // Append the image file
    });
  
    // Step 7: Send the FormData to the API using your service
    this.compaignService.addCompaign(formData).subscribe({
      next: (response) => {
        this.toastr.success(response.message, 'Success');
        console.log('Campaign submitted successfully', response);
        this.router.navigate(['admin/campaigns/compaign-list']);
        this.resetForm();
      },
      error: (error) => {
        console.error('Failed to submit campaign', error);
        this.toastr.error(error.message || 'Failed to submit campaign', 'Error');
      },
    });
  }
  
  
  // Optional Helper Method to Reset Form
  private resetForm(): void {
    this.campaignForm.reset();
    this.images = [];
    this.hasPromotions = false;
  }
  

  formatTime(time: string): string {
    const [hours, minutes] = time.split(':');
    return `${hours}:${minutes}:00`;
  }
  showPromotionDialog(): void {
    this.displayPromotionDialog = true;
  }

  hidePromotionDialog(): void {
    this.displayPromotionDialog = false;
  }

  onPromotionSubmit(): void {
    // Handle the submission logic here
    console.log({
      promotionName: this.promotionName,
      selectedTemplate: this.selectedTemplate,
      description: this.description
    });

    this.hidePromotionDialog(); // Close the dialog after submission
  }
  onPromotionAdd(){
    
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
    formData.append('start_date', this.formattedStartDatePromotion || '');
    formData.append('end_date', this.formattedEndDatePromotion || '');
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
    this.imagesPromotion.forEach((image: File) => {
      formData.append('images[]', image, image.name);
    });
  
    // Send the FormData to the API using your service
    this.isLoading = true;
    this.loadingText = 'Processing..';
  
    this.compaignService.addpromotions(formData).subscribe({
      next: (response) => {
        if (response.success) {
          // Success case
          this.toastr.success(response.message, 'Success');
          this.isLoading = false;
          this.loadingText = '';
          this.promotionForm.reset()
          this.imagesPromotion = [];
          this.imageUrlsPromotion = [];
          this.displayPromotionDialog = false;
          this.getPromotions()
          
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
  onPromotionCancel(){
    this.displayPromotionDialog = false;

  }
}
