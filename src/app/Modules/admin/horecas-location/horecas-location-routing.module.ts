import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CountriesComponent } from './components/countries/countries.component';
import { CitiesComponent } from './components/cities/cities.component';
import { AreasComponent } from './components/areas/areas.component';
import { RegionsComponent } from './components/regions/regions.component';

const routes: Routes = [
  {path:'countries',component:CountriesComponent},
  {path:'cities',component:CitiesComponent},
  {path:'areas',component:AreasComponent},
  {path:'regions',component:RegionsComponent}


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HorecasLocationRoutingModule { }
