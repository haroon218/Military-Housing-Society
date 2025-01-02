import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { TableModule } from 'primeng/table';
import { AuthService } from '../../../../../services/auth.service';
import { CommonModule } from '@angular/common';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { DialogModule } from 'primeng/dialog';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Footer } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { LocationService } from '../../../../../services/location.service';

@Component({
  selector: 'app-regions',
  standalone: true,
  imports: [TranslateModule,TableModule,CommonModule,BreadcrumbModule,DialogModule,Footer,ReactiveFormsModule,ButtonModule],
  templateUrl: './regions.component.html',
  styleUrl: './regions.component.css'
})
export class RegionsComponent {
  customers: any[] = [];
  displayAddRegionDialog: boolean = false;
  addRegionForm!: FormGroup;
    loading: boolean = true;
    currentPage: number = 1;
    perPage: number = 10; // Adjust as needed
    totalRecords: number = 0; // Total records from API
    constructor(private locationService:LocationService,    private fb: FormBuilder,
      private userService: AuthService,
  ){
this.loadRegions()
    }

  initializeForm() {
    this.addRegionForm = this.fb.group({
      name: ['', Validators.required]
    });
  }
  ngOnInit(): void {
    this.initializeForm();
  }
    loadRegions(): void {
      this.loading = true;
      debugger
      this.locationService.getRegions().subscribe({
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
    openAddRegionDialog() {
      this.displayAddRegionDialog = true;
    }
  
    closeAddRegionDialog() {
      this.displayAddRegionDialog = false;
    }
  
    onAddRegion() {
      if (this.addRegionForm.valid) {
      
  
        // Call the API to add the region
        this.locationService.addRegion(this.addRegionForm.value).subscribe({
          next: (response) => {
            
            // Close the dialog
            this.closeAddRegionDialog();
            
            // Optionally, reset the form
            this.addRegionForm.reset();
  
            // Refresh the region list
            this.loadRegions();
          },
          error: (error) => {
            console.error('Error adding region:', error);
          }
        });
      } else {
        this.addRegionForm.markAllAsTouched();
      }
    }
}
