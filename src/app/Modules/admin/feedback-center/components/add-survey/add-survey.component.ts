import { Component, ElementRef, ViewChild } from '@angular/core';
import { AuthService } from '../../../../../services/auth.service';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import flatpickr from 'flatpickr';
import { CompaignsService } from '../../../../../services/compaigns.service';
import { SliderModule } from 'primeng/slider';
import { InputSwitchModule } from 'primeng/inputswitch';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-add-survey',
  standalone: true,
  imports: [DropdownModule, FormsModule, NgFor, NgIf,SliderModule,InputSwitchModule,InputTextModule,ReactiveFormsModule,ButtonModule,CommonModule],
  templateUrl: './add-survey.component.html',
  styleUrls: ['./add-survey.component.css'],
})
export class AddSurveyComponent {
  imageUrls: any[] = [];
  images:any[]=[]
  points:any
  companies: any = [];
  isLoading:boolean=false;
  loadingText:string=''
  surveyName: string = '';
  dateRange: string = '';
  description: string = '';
  selectedCompany: any = null;
  @ViewChild('datePicker', { static: false }) datePicker!: ElementRef;
  formattedStartDate!: string;
  formattedEndDate!: string;
  
  questionTypes = [
    { id: 'single', name: 'Single Choice' },
    { id: 'multiple', name: 'Multiple Choice' },
    { id: 'paragraph', name: 'Paragraph' },
    { id: 'true_false', name: 'True/False' },
    { id: 'rating', name: 'Rating' },
    { id: 'opinion_scale', name: 'Opinion Scale' },
    { id: 'dropdown', name: 'Dropdown' },
  ];

  questions: any[] = [
    {
      type: 'single',
      question_text: '',
      required: 0,
      options: [
        { option_text: 'Option 1', selected: false, deleted: false },
        { option_text: 'Option 2', selected: false, deleted: false },
      ],      },
      
  ];
  surveyDetails: any;
  surveyId: string | null = null;
  constructor(private companyService: AuthService, private service: CompaignsService,private route: ActivatedRoute,private router: Router,private toastr:ToastrService) {
    this.loadCustomers();
  }
  ngOnInit(): void {
    // Get the survey ID from query parameters
    this.route.queryParams.subscribe((params:any) => {
      this.surveyId = params['id'];
      if (this.surveyId) {
        this.getSurveyDetails(this.surveyId);
      }
    });
  }

  getSurveyDetails(id: string): void {
    // Call your API to get the survey details
    this.service.getSurveyDetailById(id).subscribe(
      (data) => {
        debugger
        this.surveyDetails = data.data.row;
        this.surveyName=this.surveyDetails.name;
        this.points=this.surveyDetails.points;
        debugger
        this.imageUrls = this.surveyDetails.images
        ? [
            {
              url: this.surveyDetails.images[0].url,
              id: this.surveyDetails.images[0].id,
            },
          ]
        : [];
        this.description=this.surveyDetails.description
        this.selectedCompany=this.surveyDetails.company_id
        this.questions=this.surveyDetails.questions;
        const startDate = this.surveyDetails.start_date ? new Date(this.surveyDetails.start_date) : null;
        const endDate = this.surveyDetails.end_date ? new Date(this.surveyDetails.end_date) : null;
        this.formattedStartDate = this.surveyDetails.start_date;
        this.formattedEndDate = this.surveyDetails.end_date ;
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
      },
      (error) => {
        console.error('Error fetching survey details', error);
      }
    );
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
          console.log('Formatted Start Date:', this.formattedStartDate);
          console.log('Formatted End Date:', this.formattedEndDate);
        }
      },
    });
  }
  showOptions(type: string): boolean {
    return type === 'single' || type === 'multiple' || type === 'dropdown';
  }
  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
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
          debugger
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
  loadCustomers(): void {
    const queryParams: any = {};
    this.companyService.getCustomers(queryParams).subscribe({
      next: (response: any) => {
        this.companies = response.data.data;
      },
      error: (error: any) => {
        console.error('Error fetching customers:', error);
      },
    });
  }

  onQuestionTypeChange(index: number): void {
    const question = this.questions[index];
    if (question.type === 'single') {
      question.options= [
        { option_text: 'Option 1', selected: false, deleted: false },
        { option_text: 'Option 2', selected: false, deleted: false },
      ]
    } else if (question.type === 'multiple') {
      question.options= [
        { option_text: 'Option 1', selected: false, deleted: false },
        { option_text: 'Option 2', selected: false, deleted: false },
      ]
    } else if (question.type === 'true_false') {
      question.options  = [
        { option_text: 'true', selected: false, deleted: false },
        { option_text: 'false', selected: false, deleted: false },
      ];
    } else if (question.type === 'paragraph') {
      question.options = [];
    } else if (question.type === 'rating') {
      question.options = ['1', '2', '3', '4', '5'];
    } else if (question.type === 'opinion_scale') {
      question.options = ['1', '2', '3', '4', '5'];
    } else if (question.type === 'dropdown') {
      question.options = ['Option 1', 'Option 2', 'Option 3'];
    }
  }

  addOption(index: number): void {
    this.questions[index].options.push({
      option_text: `Option ${this.questions[index].options.length + 1}`, // Default option text
      selected: false, // Default selected state
      deleted: false, // Default deleted state
    });
  }

  addOtherOption(index: number): void {
    this.questions[index].options.push('Other');
  }

  
  removeOption(questionIndex: number, optionIndex: number): void {
    const option = this.questions[questionIndex].options[optionIndex];
  
    // Mark the option as deleted without removing it from the array
    option.deleted = true;
  
    // Now, you can choose to **not remove** it from the array, just mark it as deleted.
    // This will keep the option in the array but hide it in the UI.
  }
  
  
  
  
  trackByIndex(index: number, item: any): number {
    return index; // Unique identifier for each option
  }

  addQuestion(): void {
    this.questions.push({
      type: 'single', // or any default type you want
      question_text: '',
      required: 0, // 0 or 1 based on whether the question is required
      options: [
        { option_text: 'Option 1', selected: false, deleted: false },
        { option_text: 'Option 2', selected: false, deleted: false },
      ],
    });
  }
  
  onToggleChange(event: any, index: number): void {
    this.questions[index].required = event.checked ? 1 : 0;
  }
  submitSurvey(): void {
    debugger;
  
    // Perform validation
    if (!this.surveyName || !this.selectedCompany || !this.formattedStartDate  || !this.points || !this.description) {
      this.toastr.error('All fields are required. Please fill out all fields.', 'Validation Error');
      return;
    }
  
    if (!this.images || this.images.length === 0) {
      this.toastr.error('At least one image is required.', 'Validation Error');
      return;
    }
  
    for (let i = 0; i < this.questions.length; i++) {
      const question = this.questions[i];
      if (!question.type || !question.question_text) {
        this.toastr.error(`Question ${i + 1} is incomplete. Please fill out all required fields.`, 'Validation Error');
        return;
      }
      if ((question.type === 'single' || question.type === 'multiple' || question.type === 'dropdown') && (!question.options || question.options.length === 0)) {
        this.toastr.error(`Question ${i + 1} is missing options. Please provide options.`, 'Validation Error');
        return;
      }
    }
  
    // Create FormData and append values
    const surveyData = new FormData();
    surveyData.append('name', this.surveyName || '');
    surveyData.append('company_id', this.selectedCompany ? this.selectedCompany : '');
    surveyData.append('start_date', this.formattedStartDate || '');
    surveyData.append('end_date', this.formattedEndDate || '');
    surveyData.append('points', this.points || '');
    surveyData.append('description', this.description || '');
    surveyData.append('status', '1'); // Assuming survey is active
  
    this.images.forEach((image: File) => {
      surveyData.append('images[]', image, image.name);
    });
  
    this.questions.forEach((question, index) => {
      surveyData.append(`question[${index}][type]`, question.type);
      surveyData.append(`question[${index}][question_text]`, question.question_text || '');
      surveyData.append(`question[${index}][required]`, question.required ? '1' : '0');
  
      if (question.type === 'single' || question.type === 'multiple' || question.type === 'dropdown') {
        question.options.forEach((option: any) => {
          surveyData.append(`question[${index}][options][]`, option.option_text);
        });
      }
    });
  
    this.isLoading = true; // Start loader
    this.loadingText = 'Processing...';
    this.service.addSurvey(surveyData).subscribe({
      next: (response) => {
        if (response.success) {
          this.toastr.success(response.message, 'Success');
          // Navigate to another route (e.g., survey list page)
          this.router.navigate(['admin/feedback/feed-back']);
        } else {
          console.error('Survey submission failed:', response.message || 'Unknown error');
        }
        console.log('Survey submitted successfully!', response);
      },
      error: (error) => {
        console.error('Error submitting survey:', error);
      },
      complete: () => {
        this.isLoading = false; // Stop loader
      },
    });
  }
  
  onSubmit(){
    if(this.surveyId){
this.UpdateSurvey()
    }else{
     this.submitSurvey()
    }
  }
  UpdateSurvey(): void {
    if (!this.surveyName || !this.selectedCompany || !this.formattedStartDate  || !this.points || !this.description) {
      this.toastr.error('All fields are required. Please fill out all fields.', 'Validation Error');
      return;
    }
  
    if (!this.images || !this.imageUrls) {
      this.toastr.error('At least one image is required.', 'Validation Error');
      return;
    }
  
    for (let i = 0; i < this.questions.length; i++) {
      const question = this.questions[i];
      if (!question.type || !question.question_text) {
        this.toastr.error(`Question ${i + 1} is incomplete. Please fill out all required fields.`, 'Validation Error');
        return;
      }
      if ((question.type === 'single' || question.type === 'multiple' || question.type === 'dropdown') && (!question.options || question.options.length === 0)) {
        this.toastr.error(`Question ${i + 1} is missing options. Please provide options.`, 'Validation Error');
        return;
      }
    }
    const surveyData = new FormData();

    // General survey information
    surveyData.append('name', this.surveyName || '');
    surveyData.append('company_id', this.selectedCompany ? this.selectedCompany : '');
    surveyData.append('start_date', this.formattedStartDate || '');
    surveyData.append('end_date', this.formattedEndDate || '');
    surveyData.append('description', this.description || '');
    surveyData.append('points', this.points || '');
    surveyData.append('_method', 'PUT');
    surveyData.append('status', '1'); // Assuming survey is active
    this.images.forEach((image: File) => {
      surveyData.append('images[]', image, image.name);  // Ensure that 'image' is the correct field name expected by your API
    });
    // Dynamically create the questions keys with indexed names
    this.questions.forEach((question, index) => {
      // Check for question ID, default to 0 if not present
      surveyData.append(`question[${index}][id]`, question.id || '0');
      surveyData.append(`question[${index}][type]`, question.type);
      surveyData.append(`question[${index}][question_text]`, question.question_text || '');
      surveyData.append(`question[${index}][required]`, question.required ? '1' : '0');
  
      if (question.type === 'single' || question.type === 'multiple' || question.type === 'dropdown') {
        // Handle the options (including deleted options)
        question.options.forEach((option: any, optionIndex: number) => {
          debugger
          // Check for option ID, default to 0 if not present
          surveyData.append(`question[${index}][options][${optionIndex}][id]`, option.id || '0');
          surveyData.append(`question[${index}][options][${optionIndex}][text]`,option.option_text);
          if (option.deleted) {
            surveyData.append(`question[${index}][options][${optionIndex}][option_delete]`, '1');
          }
        });
      }
    });
    this.isLoading = true; // Start loader
    this.loadingText = 'Processing...';
    // Call the update service method to submit the survey data
    this.service.updateSurvey(this.surveyId, surveyData).subscribe({
      next: (response) => {
        if (response.success) {
          this.toastr.success(response.message,'Success')
          // Navigate to another route (e.g., survey list page)
        this.router.navigate(['admin/feedback/feed-back']);
      } else {
        console.error('Survey submission failed:', response.message || 'Unknown error');
      }
        console.log('Survey updated successfully!', response);
      },
      error: (error) => {
        console.error('Error updating survey:', error);
      },
    });
  }
  
  
  
}
