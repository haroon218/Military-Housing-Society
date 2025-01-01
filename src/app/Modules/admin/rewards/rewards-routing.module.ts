import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RewardsListComponent } from './components/rewards-list/rewards-list.component';
import { OfferListComponent } from './components/offer-list/offer-list.component';

const routes: Routes = [
  {path:'rewards-list',component:RewardsListComponent},
  {path:'offer-list',component:OfferListComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RewardsRoutingModule { }
