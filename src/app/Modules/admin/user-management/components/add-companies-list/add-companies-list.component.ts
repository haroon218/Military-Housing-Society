import { Component, NO_ERRORS_SCHEMA } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { AuthService } from '../../../../../services/auth.service';
import { MessageService } from 'primeng/api';
import { MessageModule } from 'primeng/message';
import { ToastModule } from 'primeng/toast';
import { RippleModule } from 'primeng/ripple';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { DropdownModule } from 'primeng/dropdown';
import { UserManagementService } from '../../../../../services/user-management.service';

@Component({
  selector: 'app-add-companies-list',
  standalone: true,
  imports: [FormsModule,MessageModule,ToastModule,RippleModule,
    ReactiveFormsModule,
    InputTextModule,DropdownModule,
    ButtonModule,CommonModule],
    providers: [MessageService],
  templateUrl: './add-companies-list.component.html',
  styleUrl: './add-companies-list.component.css'
})
export class AddCompaniesListComponent {
  groups:any=[];
  addCompanyForm: FormGroup;

  constructor(private user_management_service:UserManagementService,private fb: FormBuilder, private apiService: AuthService, private messageService: MessageService,private router:Router) {
    // Initialize the form
    this.addCompanyForm = this.fb.group({
      name: ['', Validators.required], // Name field
      mobile: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]], // Mobile field (10 digits)
      email: ['', [Validators.required, Validators.email]], // Email field
      address: ['', Validators.required], // Address field
      group_id:['']
    });
    this.fetchGroups()
  }

  ngOnInit(): void {}
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
  onSubmit(): void {
    if (this.addCompanyForm.valid) {
      // Call the API to add the company
      this.apiService.addCompany(this.addCompanyForm.value).subscribe({
        next: (response: any) => {
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Company Added Successfully' });
          
          // Navigate to the companies list
          this.router.navigate(['admin/user-management/companies-list']); // replace with your actual route
  
          // Reset the form after navigation
          this.addCompanyForm.reset();
        },
        error: (error: any) => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to add company!' });
        },
      });
    } 
  }
  
}
