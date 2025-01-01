import { NgModule } from '@angular/core';
import { CommonModule, LocationStrategy, PathLocationStrategy } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { MessageService } from 'primeng/api';
import { BreadcrumbComponent } from './breadcrumb/breadcrumb.component';
import { RouterModule } from '@angular/router';
import { MessagesModule } from 'primeng/messages';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule,
    AdminRoutingModule,
    BreadcrumbComponent,
 
  ],
  exports:[BreadcrumbComponent],
   providers: [{ provide: LocationStrategy, useClass: PathLocationStrategy }]
})
export class AdminModule { }
