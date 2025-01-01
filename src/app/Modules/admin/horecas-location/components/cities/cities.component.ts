import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { Footer } from 'primeng/api';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { TableModule } from 'primeng/table';
import { AuthService } from '../../../../../services/auth.service';
import { LocationService } from '../../../../../services/location.service';
import { ToastrService } from 'ngx-toastr';
import { DropdownModule } from 'primeng/dropdown';

@Component({
  selector: 'app-cities',
  standalone: true,
  imports: [TranslateModule,TableModule,CommonModule,BreadcrumbModule,DialogModule,Footer,ReactiveFormsModule,ButtonModule,DropdownModule],
  templateUrl: './cities.component.html',
  styleUrl: './cities.component.css'
})
export class CitiesComponent {



  loadingText:any=''
  isLoading:boolean=false
  countryIdToDelete:any
  selectedRegion:any
  customers: any[] = [];
  CountryNameToDelete:any
  delete:boolean=false
  displayAddCountryDialog: boolean = false;
  addRegionForm!: FormGroup;
    loading: boolean = true;
    currentPage: number = 1;
    countries:any=[]
    selectedCountry: any;
    isEditMode: boolean = false;
    perPage: number = 10; // Adjust as needed
    totalRecords: number = 0; // Total records from API
    constructor(private locationService:LocationService,    private fb: FormBuilder,
      private userService: AuthService,private toastr:ToastrService
  ){
  this.loadAreas()
    }

  initializeForm() {
    this.addRegionForm = this.fb.group({
      name: ['', Validators.required],
      area_id:['']
    });
  }
  ngOnInit(): void {
    this.initializeForm();
    this.fetchAreas()
  }
  openEditDialog(country: any): void {
    this.isEditMode = true;
    this.selectedCountry = country;
    this.displayAddCountryDialog = true;

    this.addRegionForm.patchValue({
      name: country.name,
      city_id: country.city_id,
    });
  }

  openAddRegionDialog(): void {
    this.isEditMode = false;
    this.selectedCountry = null;
    this.displayAddCountryDialog = true;

    // Reset the form for adding new country
    this.addRegionForm.reset();
  }

  onAddOrUpdateRegion(): void {
    if (this.addRegionForm.invalid) {
      // Mark all controls as touched to show validation errors
      this.addRegionForm.markAllAsTouched();
      return; // Exit the method if the form is invalid
    }
  
    this.isLoading = true;
    this.loadingText = 'Processing..'; // Initial text
  
    const countryData = {
      ...this.addRegionForm.value,
      _method: this.isEditMode ? 'PUT' : 'POST', // Add _method key
    };
  
    const apiCall = this.isEditMode 
      ? this.locationService.updateCity(this.selectedCountry.id, countryData) 
      : this.locationService.addCity(countryData);
  
    apiCall.subscribe({
      next: (response) => {
        debugger
        this.toastr.success(response.message, 'Success');
        this.displayAddCountryDialog = false; // Close the dialog
        this.isLoading = false;
        this.loadAreas()
        this.loadingText = ''; // Reset loading text
        // Refresh country list or perform any other necessary actions
      },
      error: (error) => {
        debugger
        this.toastr.error(error.message, 'Error');
        this.isLoading = false;
        this.loadingText = ''; // Reset loading text
      },
    });
  }
  
  
  

    onRegionIdChange(event: any): void {
    this.loadAreas(this.perPage,event.value)
    }
    loadAreas(per_page?:any,region_id?:any): void {
      this.loading = true;
      debugger
      this.locationService.getCities(per_page,region_id).subscribe({
        next: (response: any) => {
          debugger
          this.customers = response.data.data; 
          this.loading = false;
        },
        error: (error: any) => {
          console.error('Error fetching customers:', error);
          this.loading = false;
        },
      });
    }
   
    closeAddRegionDialog(): void {
      this.displayAddCountryDialog = false;
    }
    fetchAreas() {
      // Call your API to get regions (replace with your API URL)
      this.locationService.getAreas().subscribe({
        next: (data) => {
          debugger
          this.countries = data.data.data; // Assuming the API response is an array of region objects
        },
        error: (error) => {
          console.error('Failed to fetch regions', error);
        }
      });
    }
    onDelete(id: number, name: string) {
      this.countryIdToDelete = id;
      this.CountryNameToDelete = name;
      this.delete = true;
    }
    confirmDelete() {
      if (this.countryIdToDelete !== null) {
        this.isLoading = true; // Start loader
        this.loadingText = 'Deleting...';
        this.locationService.deleteCity(this.countryIdToDelete).subscribe({
          next: (response:any) => {
            this.toastr.success(response.message, 'Success');
  
            this.customers = this.customers.filter((group:any) => group.id !== this.countryIdToDelete);
            // this.totalRecords = this.groups.length;
            this.delete = false;
            this.isLoading = false;
            this.loadingText = ''; // Stop loader
            this.countryIdToDelete = null;
            this.CountryNameToDelete = null;
          },
          error: (error) => {
            this.loadingText = '';
            this.isLoading = false; // Stop loader even if there's an error
          }
        });
      }
    }
  
    // Method to handle the cancellation of deletion
    onDeleteCancel() {
      this.delete = false;
      this.countryIdToDelete = null;
      this.CountryNameToDelete = null;
    }
}



