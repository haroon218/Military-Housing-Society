import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TherapistDetailComponent } from './therapist-detail/therapist-detail.component';
import { StaffComponent } from './staff/staff.component';
import { HouseOwnersComponent } from './house-owners/house-owners.component';

const routes: Routes = [
  {path:'house-owner',component:HouseOwnersComponent},
  {path:'staff',component:StaffComponent},
  {path:'detail',component:TherapistDetailComponent}


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsersRoutingModule { }
