import { Routes } from '@angular/router';
import { AuthGuard } from './app/Modules/admin/Shared/Guards/AuthGuard';
import { Landing } from './app/Modules/landing/landing';


export const appRoutes: Routes = [
    { path: '', redirectTo: 'landing', pathMatch: 'full' ,}, // Redirect to 'auth' on app start
    { 
        path: 'auth',
        loadChildren: () => import('./app/Modules/auth/auth.module').then(m => m.AuthModule)
    },
    { 
        path: 'admin',
        loadChildren: () => import('./app/Modules/admin/admin.module').then(m => m.AdminModule)
    },
    { path: 'landing', component: Landing },

    { path: '**', redirectTo: 'auth' } 
];
