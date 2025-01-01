import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserManagementRoutingModule } from './user-management-routing.module';
import { MessagesModule } from 'primeng/messages';
import { MessageService } from 'primeng/api';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    UserManagementRoutingModule,
    MessagesModule,
  ],
  providers: [MessageService]

})
export class UserManagementModule { }
