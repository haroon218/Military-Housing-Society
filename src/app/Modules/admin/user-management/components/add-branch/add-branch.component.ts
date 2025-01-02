import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { AuthService } from '../../../../../services/auth.service';
import { CommonModule } from '@angular/common';
import { SecureStorageService } from '../../../secure-storage.service';

@Component({
  selector: 'app-add-branch',
  standalone: true,
  imports: [ButtonModule,ReactiveFormsModule,FormsModule,CommonModule],
  templateUrl: './add-branch.component.html',
  styleUrl: './add-branch.component.css'
})
export class AddBranchComponent {
  currentPage: number = 1;
    perPage: number = 10; // Adjust as needed
  branchForm!: FormGroup;
  companies:any=[]
  constructor(
    private companyService: AuthService,
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,private secureStorageService:SecureStorageService
  ) {}

  ngOnInit(): void {
    this.branchForm = this.fb.group({
      name: ['', Validators.required],
      telephone_no: ['',], // For numeric phone number
      address: ['', Validators.required],
      timings: ['', Validators.required],
      company_id: ['', Validators.required] // This will be dynamically set
    });
    debugger
    // this.loadCustomers()
  //  const companyId = this.secureStorageService.getId(); // Get the company ID from secure storage
  //   this.branchForm.patchValue({
  //     company_id: companyId // Use patchValue to assign the company_id
  //   });  
  }

  onSubmit(): void {
    debugger
    if (this.branchForm.valid) {
      this.authService.addBranch(this.branchForm.value).subscribe({
        next: (response:any) => {
          console.log('Branch added successfully!', response);
          this.router.navigate(['/admin/user-management/branches']); // Navigate to branches list after adding
        },
        error: (error:any) => {
          console.error('Error adding branch:', error);
        }
      });
    } else {
      console.error('Form is not valid!');
    }
  }
  // loadCustomers(): void {
  //   debugger
  //   this.companyService.getCustomers(this.currentPage, this.perPage).subscribe({
  //     next: (response: any) => {
  //       debugger
  //       this.companies = response.data.data; 
  //     },
  //     error: (error: any) => {
  //       console.error('Error fetching customers:', error);
  //     },
  //   });
  // }
}
