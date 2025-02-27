import { Component, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { RippleModule } from 'primeng/ripple';
import { AuthService } from '../../service/auth.service';
import { TrigerToastService } from '../../../admin/Shared/services/triger-toast.service';
import { SharedService } from '../../../admin/Shared/services/shared.service';
export interface LoginPayload{
  email: string;
  password: any;
}
export interface LoginResponse {
  token: string;
  Success:boolean;
  Message:string;
  status:number;
  Data: {
    address: number;
    name: string;
    email: string;
    token:string;
    user_id:string;
    phone:string;
    otp_is_verified:number
  };
}
@Component({
  selector: 'app-login',
  standalone:true,
  imports: [ButtonModule, CheckboxModule, InputTextModule, PasswordModule, RouterModule, RippleModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  private router=inject(Router);
  private sharedservice=inject(SharedService)
  private authService=inject(AuthService);
  private fb=inject(FormBuilder);
  private toastService=inject(TrigerToastService)
  loginForm :FormGroup
  loading: boolean = false;

  constructor() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      remember: [false]
    });
  }
  userLogin() {
    
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }
  
    this.loading = true;
    this.authService.Login(this.loginForm.value).subscribe({
      next: (response: any) => {
        this.loading = false;
        if (response?.Success) {
          localStorage.setItem('Data@Salvao', JSON.stringify(response.Data));
          
          // **Update BehaviorSubject with new user data**
          this.sharedservice.sharedData.next(response.Data); 
          
          this.router.navigate(['/admin']);
          this.toastService.showToast({
            type: 'success',
            shortMessage: 'Success!',
            detail: response.Message
          });
        } else {
          this.toastService.showToast({
            type: 'error',
            shortMessage: 'Error!',
            detail: response.Message
          });
        }
      },
      error: (error) => {
        this.loading = false;
      }
    });
  }
  
  
  ngOnDestroy(): void {
    
  }
}
