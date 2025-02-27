import { Routes } from '@angular/router';
import { AuthGuard } from './app/Modules/admin/Shared/Guards/AuthGuard';


export const appRoutes: Routes = [
    { path: '', redirectTo: 'auth', pathMatch: 'full' ,}, // Redirect to 'auth' on app start
    { 
        path: 'auth',
        loadChildren: () => import('./app/Modules/auth/auth.module').then(m => m.AuthModule)
    },
    { 
        path: 'admin',
        loadChildren: () => import('./app/Modules/admin/admin.module').then(m => m.AdminModule)
    },
    { path: '**', redirectTo: 'auth' } 
];
