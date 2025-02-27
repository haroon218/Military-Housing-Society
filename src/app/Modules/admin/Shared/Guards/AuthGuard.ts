import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate{
    constructor(private router: Router) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
      let userData = localStorage.getItem('Data@Salvao');

      // 🔹 If user is logged in and trying to access login page, redirect to admin
      if (userData && route.routeConfig?.path?.startsWith('auth')) {
        this.router.navigate(['/admin']);
        return false;
      }
  
      // 🔹 If user is not logged in and trying to access protected routes, redirect to login
      if (!userData && route.routeConfig?.path?.startsWith('admin')) {
        this.router.navigate(['/auth']);
        return false;
      }
  
      // ✅ Allow access if conditions are met
      return true;
    }
     
}