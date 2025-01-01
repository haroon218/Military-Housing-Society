import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr'; // Import ToastrService

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router); // Inject Router
  const toastr = inject(ToastrService); // Inject ToastrService

  // Retrieve the token from localStorage
  const token = localStorage.getItem('token');
  
  // Check if the token exists and is not empty
  if (token) {
    return true; // Allow access to the route
  } else {
    // Show a toast message and navigate to the login page if no token is found
    toastr.warning('Please login to access this page', 'Access Denied');
    router.navigate(['/login']);
    return false; // Deny access to the route
  }
};
