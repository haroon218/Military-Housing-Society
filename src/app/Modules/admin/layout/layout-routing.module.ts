import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppLayout } from './component/app.layout';
import { DashboardComponent } from '../dashboard/dashboard/dashboard.component';

const routes: Routes = [
 {
    path: '',
    component: AppLayout,
    children: [
        { path: '', redirectTo: 'dashboard', pathMatch: 'full'},
        { path: 'dashboard', component: DashboardComponent },
        { 
          path: 'user',
          loadChildren: () => import('../users/users.module').then(m => m.UsersModule)
      },
      { 
        path: 'auth',
        loadChildren: () => import('../roles-permission/roles-permission.module').then(m => m.RolesPermissionModule)
    },
    { 
      path: 'bills',
      loadChildren: () => import('../billing/billing.module').then(m => m.BillingModule)
  },
    ],
},];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LayoutRoutingModule { }
