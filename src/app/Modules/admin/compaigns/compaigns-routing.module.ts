import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CompaignListComponent } from './components/compaign-list/compaign-list.component';
import { AddCompaignComponent } from './components/add-compaign/add-compaign.component';
import { PromotionListComponent } from './components/promotion-list/promotion-list.component';

const routes: Routes = [
  {path:'compaign-list',component:CompaignListComponent},
  {path:'add-compaign',component:AddCompaignComponent},
  {path:'promotion-list',component:PromotionListComponent},

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CompaignsRoutingModule { }
