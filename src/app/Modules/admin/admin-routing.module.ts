import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardLayoutComponent } from './layout/dashboard-layout/dashboard-layout.component';
import { RegionsComponent } from './horecas-location/components/regions/regions.component';
import { CategoriesComponent } from './categories/components/categories/categories.component';

const routes: Routes = [
  {
    path: '',
    component: DashboardLayoutComponent,
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
      { 
        path: 'dashboard', 
        loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule)
      },
      { 
        path: 'reports', 
        loadChildren: () => import('./reports/reports.module').then(m => m.ReportsModule)
      },
      { 
        path: 'user-management', 
        data: { breadcrumb: 'User Management' },
        loadChildren: () => import('./user-management/user-management.module').then(m => m.UserManagementModule)
      },
      { 
        path: 'rewards', 
        loadChildren: () => import('./rewards/rewards.module').then(m => m.RewardsModule)
      },
      { 
        path: 'campaigns', 
        loadChildren: () => import('./compaigns/compaigns.module').then(m => m.CompaignsModule)
      },
      { 
        path: 'loctions', 
        loadChildren: () => import('./horecas-location/horecas-location.module').then(m => m.HorecasLocationModule)
      },
      { 
        path: 'feedback', 
        loadChildren: () => import('./feedback-center/feedback-center.module').then(m => m.FeedbackCenterModule)
      },
      { 
        path: 'categories', 
        loadChildren: () => import('./categories/categories.module').then(m => m.CategoriesModule)
      }, 
      { 
        path: 'roles', 
        loadChildren: () => import('./roles/roles.module').then(m => m.RolesModule)
      },        ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
