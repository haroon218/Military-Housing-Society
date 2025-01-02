import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CompaniesListComponent } from './components/companies-list/companies-list.component';
import { CustomersListComponent } from './components/customers-list/customers-list.component';
import { AddCompaniesListComponent } from './components/add-companies-list/add-companies-list.component';
import { CompanyInformationComponent } from './components/company-information/company-information.component';
import { AddBranchComponent } from './components/add-branch/add-branch.component';
import { CoustomerInformationComponent } from './components/coustomer-information/coustomer-information.component';
import { GroupListComponent } from './components/group-list/group-list.component';
import { GroupInformationComponent } from './components/group-information/group-information.component';
import { BranchesComponent } from './components/branches/branches.component';
import { EmployesComponent } from './components/employes/employes.component';

const routes: Routes = [
  {path:'companies-list',component:CompaniesListComponent,data: { breadcrumb: 'Companies List' }},
  {path:'customer-list',component:CustomersListComponent},
  {path:'add-company',component:AddCompaniesListComponent},
  {path:'view-list/:id',component:CompanyInformationComponent},
  {path:'company-branch',component:AddBranchComponent},
  {path:'customer-view',component:CoustomerInformationComponent},
  {path:'group-list',component:GroupListComponent},
  {path:'group-information/:id',component:GroupInformationComponent},
  {path:'branches',component:BranchesComponent},
  {path:'add-branch',component:AddBranchComponent},
  {path:'employees-list',component:EmployesComponent},





];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserManagementRoutingModule { }
