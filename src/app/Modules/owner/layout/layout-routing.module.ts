import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppLayout } from './component/app.layout';
import { OwnerComplaintsComponent } from './owner-complaints/owner-complaints.component';
import { BillViewComponent } from './bill-view/bill-view.component';
import { OwnerEventsComponent } from './owner-events/owner-events.component';


const routes: Routes = [
 {
    path: '',
    component: AppLayout,
    children: [
        { path: '', redirectTo: 'complaints', pathMatch: 'full'},
  //       { path: 'dashboard', component: DashboardComponent },
  //       { path: 'Complaints', component: ComplaintsComponent },

        { 
          path: 'complaints',component:OwnerComplaintsComponent
          
       },
       { 
          path: 'bills',component:BillViewComponent
          
       },
        { 
          path: 'events',component:OwnerEventsComponent
          
       },
  //     { 
  //       path: 'auth',
  //       loadChildren: () => import('../roles-permission/roles-permission.module').then(m => m.RolesPermissionModule)
  //   },
  //   { 
  //     path: 'bills',
  //     loadChildren: () => import('../billing/billing.module').then(m => m.BillingModule)
  // },
  // {path:'block',component:BlockComponent},
  // {path:'area',component:AreaComponent},
  // {path:'plot',component:PlotsComponent}

    ],

    
},];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LayoutRoutingModule { }
