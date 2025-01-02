import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../../../../services/auth.service';
import { LocationService } from '../../../../../services/location.service';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { Footer } from 'primeng/api';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { TableModule } from 'primeng/table';
import { HttpParams } from '@angular/common/http';

@Component({
  selector: 'app-roles',
  standalone: true,
  imports: [TranslateModule,TableModule,CommonModule,BreadcrumbModule,DialogModule,Footer,ReactiveFormsModule,ButtonModule,DropdownModule],
  templateUrl: './roles.component.html',
  styleUrl: './roles.component.css'
})
export class RolesComponent {

  permissions = [
    
  ];
  selectedPermissions: string[] = [];
  areAllSelected = false;

  groupedPermissions: { [key: string]: string[] } = {};

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
      name:[''],
      permissions: [this.selectedPermissions] // Track selected permissions
    });
  }
  ngOnInit(): void {
    this.initializeForm();
    this.fetchPermissions()
   
    this.fetchRoles()
  }
  roleId:any
  openEditDialog(country: any): void {
    debugger
    this.isEditMode = true;
    this.displayAddCountryDialog = true;
    this.roleId=country.id
    this.getRoleInformation()
    this.addRegionForm.patchValue({
      name: country.name,
     
    });
  }
  getRoleInformation(){

  }
  openAddRegionDialog(): void {
    this.isEditMode = false;
    this.selectedCountry = null;
    this.displayAddCountryDialog = true;

    // Reset the form for adding new country
    this.addRegionForm.reset();
  }
  groupPermissions(): void {
    this.groupedPermissions = this.permissions.reduce((groups: any, permission: string) => {
      const [action, entity] = permission.split('_');
      if (!groups[entity]) groups[entity] = [];
      groups[entity].push(permission);
      return groups;
    }, {});
  }
  objectKeys = Object.keys;
  togglePermission(permission: string): void {
    const index = this.selectedPermissions.indexOf(permission);
    if (index > -1) {
      this.selectedPermissions.splice(index, 1);
    } else {
      this.selectedPermissions.push(permission);
    }
    this.addRegionForm.get('permissions')?.setValue(this.selectedPermissions);
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
      ? this.locationService.updateArea(this.selectedCountry.id, countryData) 
      : this.locationService.addArea(countryData);
  
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
  
  submit() {
    const formValue = this.addRegionForm.value; 
    const selectedPermissions = formValue.permissions; 
      let payload = new HttpParams();
    selectedPermissions.forEach((permission:any) => {
      payload = payload.append('permissions[]', permission);
    });
    payload = payload.append('name', formValue.name);
    payload = payload.append('_method','PUT');

    this.userService.updatePermissions(this.roleId,payload).subscribe({
      next: (data) => {
        debugger
        this.countries = data.data.data; // Assuming the API response is an array of region objects
      },
      error: (error) => {
        console.error('Failed to fetch regions', error);
      }
    });
    
  }
  
    onRegionIdChange(event: any): void {
    this.loadAreas(this.perPage,event.value)
    }
    loadAreas(per_page?:any,region_id?:any): void {
      this.loading = true;
      debugger
      this.locationService.getAreas(per_page,region_id).subscribe({
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
    fetchRoles() {
      // Call your API to get regions (replace with your API URL)
      this.userService.getRoles().subscribe({
        next: (data) => {
          debugger
          this.countries = data.data.data; // Assuming the API response is an array of region objects
        },
        error: (error) => {
          console.error('Failed to fetch regions', error);
        }
      });
    }
    fetchPermissions() {
      // Call your API to get regions (replace with your API URL)
      this.userService.getPermissions().subscribe({
        next: (data) => {
          debugger
          this.permissions = data.data;
          this.groupPermissions(); // Assuming the API response is an array of region objects
        },
        error: (error) => {
          console.error('Failed to fetch regions', error);
        }
      });
    }
    toggleSelectAll(): void {
      if (this.areAllSelected) {
        this.selectedPermissions = [];
      } else {
        this.selectedPermissions = Object.values(this.groupedPermissions).flat();
      }
      this.areAllSelected = !this.areAllSelected;
    }
  
    checkIfAllSelected(): boolean {
      const allPermissions = Object.values(this.groupedPermissions).flat();
      return allPermissions.every((perm) =>
        this.selectedPermissions.includes(perm)
      );
    }
    onDelete(id: number, name: string) {
      this.countryIdToDelete = id;
      this.CountryNameToDelete = name;
      this.delete = true;
    }
    confirmDelete() {
      if (this.countryIdToDelete !== null) {
        this.isLoading = true; 
        this.loadingText = 'Deleting...';
        this.locationService.deleteRole(this.countryIdToDelete).subscribe({
          next: (response:any) => {
            this.toastr.success(response.message, 'Success');
            this.countries = this.countries.filter((group:any) => group.id !== this.countryIdToDelete);
            this.delete = false;
            this.isLoading = false;
            this.loadingText = ''; 
            this.countryIdToDelete = null;
            this.CountryNameToDelete = null;
          },
          error: (error) => {
            this.loadingText = '';
            this.isLoading = false; 
          }
        });
      }
    }
    onDeleteCancel() {
      this.delete = false;
      this.countryIdToDelete = null;
      this.CountryNameToDelete = null;
    }
}




