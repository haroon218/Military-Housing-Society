import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { SharedService } from '../../../admin/Shared/services/shared.service';
import { InputOtpModule } from 'primeng/inputotp';
import { interval, Subscription } from 'rxjs';
import { TrigerToastService } from '../../../admin/Shared/services/triger-toast.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forget-password',
  imports: [ReactiveFormsModule,PasswordModule,ButtonModule,CommonModule,InputTextModule, InputOtpModule,],
  templateUrl: './forget-password.component.html',
  styleUrl: './forget-password.component.scss'
})
export class ForgetPasswordComponent {
timeLeft = 60; // 1-minute timer
  private timerSub: Subscription | null = null;
step = 1; // Step 1: Email, Step 2: OTP, Step 3: Reset Password
  loading = false;
resendClicked = false;
  emailForm: FormGroup;
  otpForm: FormGroup;
  resetForm: FormGroup;

  constructor(private fb: FormBuilder,private sharedService:SharedService,private toastService:TrigerToastService,private router:Router) {
    this.emailForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });

    this.otpForm = this.fb.group({
      otp: ['', Validators.required]
    });

    this.resetForm = this.fb.group({
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordMatch });
  }

  passwordMatch(group: FormGroup) {
    const pass = group.get('password')?.value;
    const confirm = group.get('confirmPassword')?.value;
    return pass === confirm ? null : { passwordMismatch: true };
  }

   sendOtp() {
    if (this.emailForm.invalid) return;
    this.loading = true;
    

    this.sharedService.sendPostRequest('/ForgetPassword/request-otp',this.emailForm.value).subscribe({
      next: (res:any) => {
        if(res.success){
this.toastService.showToast({
            type: 'success',
            shortMessage: 'Success!',
            detail: res.message
          });
        this.loading = false;
        this.step = 2;
         this.startTimer();
        }
         
      },
      error: (err) => {
        this.loading = false;
        
      }
    });
  }

  verifyOtp() {
    if (this.otpForm.invalid) return;
    this.loading = true;

     const payLoad={
      email:this.emailForm.value.email,
      otp:this.otpForm.value.otp
     }
    this.sharedService.sendPostRequest('/ForgetPassword/verify-otp',payLoad).subscribe({
      next: (res:any) => {
         if(res.success){
this.toastService.showToast({
            type: 'success',
            shortMessage: 'Success!',
            detail: res.message
          });
        this.loading = false;
        this.stopTimer();
        this.step = 3;
         }
      },
      error: (err) => {
        this.loading = false;
       
      }
    });
  }

  resetPassword() {
    if (this.resetForm.invalid) return;
    this.loading = true;

  
const payLoad={
email: this.emailForm.value.email,
  otp:this.otpForm.value.otp,
  newPassword: this.resetForm.value.password
}
    this.sharedService.sendPostRequest('/ForgetPassword/reset-password',payLoad).subscribe({
      next: (res:any) => {
         if(res.success){
this.toastService.showToast({
            type: 'success',
            shortMessage: 'Success!',
            detail: res.message
          });
        this.loading = false;
       
        
        this.emailForm.reset();
        this.otpForm.reset();
        this.resetForm.reset();
        this.router.navigate(['/auth/login'])
         }
      },
      error: (err) => {
        this.loading = false;
        alert(err?.error?.message || 'Password reset failed');
      }
    });
  }
  resendOtp() {
     if (this.emailForm.invalid) return;
    this.loading = true;
    

    this.sharedService.sendPostRequest('/ForgetPassword/request-otp',this.emailForm.value).subscribe({
      next: (res) => {
       this.loading = false;
        this.timeLeft = 60;
        this.startTimer();
      },
      error: (err) => {
        this.loading = false;
        
      }
    });
   
  }

    startTimer() {
    this.stopTimer();
    this.timerSub = interval(1000).subscribe(() => {
      if (this.timeLeft > 0) {
        this.timeLeft--;
      } else {
        this.stopTimer();
      }
    });
  }

  stopTimer() {
    if (this.timerSub) {
      this.timerSub.unsubscribe();
      this.timerSub = null;
    }
  }
  ngOnDestroy() {
    this.stopTimer();
  }
}

