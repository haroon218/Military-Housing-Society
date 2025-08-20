import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppLayout } from './component/app.layout';
import { DashboardComponent } from '../dashboard/dashboard/dashboard.component';
import { BlockComponent } from '../block/block.component';
import { AreaComponent } from '../area/area.component';
import { PlotsComponent } from '../plots/plots.component';
import { ComplaintsComponent } from '../complaints/complaints.component';

const routes: Routes = [
 {
    path: '',
    component: AppLayout,
    children: [
        { path: '', redirectTo: 'dashboard', pathMatch: 'full'},
        { path: 'dashboard', component: DashboardComponent },
        { path: 'Complaints', component: ComplaintsComponent },

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
  {path:'block',component:BlockComponent},
  {path:'area',component:AreaComponent},
  {path:'plot',component:PlotsComponent}

    ],

    
},];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LayoutRoutingModule { }
