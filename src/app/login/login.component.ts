import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ToastrService, ToastrModule } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, ToastrModule], // Include ToastrModule for standalone use
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'], // Corrected "styleUrl" to "styleUrls"
})
export class LoginComponent {
  loginForm!: FormGroup;
  isLoading = false; // Add loading state

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService // Inject ToastrService
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  onLogin(): void {
    // if (this.loginForm.invalid) {
    //   this.toastr.warning('Please fill all required fields correctly.', 'Form Validation');
    //   return;
    // }

    this.isLoading = true; // Show the loader
  //   this.authService.login(this.loginForm.value).subscribe({
  //     next: (response) => {
  //       const token = response.data?.token; // Assuming the token is inside response.data
  //       if (token) {
  //         localStorage.setItem('token', token);
  //         localStorage.setItem('role', response.data.user.role); // Store the token in localStorage
  //         this.toastr.success('Logged in successfully', 'Success');
  //         this.router.navigate(['/admin']); // Redirect to the admin page
  //       } else {
  //         this.toastr.error('Token not found in the response', 'Login Failed');
  //       }
  //     },
  //     error: (error) => {
  //       this.isLoading = false;
  //       this.toastr.error('Login failed. Please try again later.', 'Error');
  //     },
  //     complete: () => {
  //       this.isLoading = false; // Hide the loader
  //     },
  //   });
  // }
  this.router.navigate(['/admin']); // Redirect to the admin page
  }
}
