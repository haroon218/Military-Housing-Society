import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RolesComponent } from './roles/roles.component';
import { PermissionsComponent } from './permissions/permissions.component';
import { AddEditRoleComponent } from './add-edit-role/add-edit-role.component';

const routes: Routes = [
  {path:'roles',component:RolesComponent},
  {path:'add-role',component:AddEditRoleComponent},
    {path:'edit-role/:id',component:AddEditRoleComponent},

  {path:'permissions',component:PermissionsComponent}

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RolesPermissionRoutingModule { }
