import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { AppMenuitem } from './app.menuitem';

@Component({
    selector: 'app-menu',
    standalone: true,
    imports: [CommonModule, AppMenuitem, RouterModule],
    template: `<ul class="layout-menu">
        <ng-container *ngFor="let item of model; let i = index">
            <li app-menuitem *ngIf="!item.separator" [item]="item" [index]="i" [root]="true"></li>
            <li *ngIf="item.separator" class="menu-separator"></li>
        </ng-container>
    </ul> `
})
export class AppMenu {
    model: MenuItem[] = [];

    ngOnInit() {
        this.model = [
            {
                label: 'Home',
                items: [ { label: 'Dashboard', icon: 'pi pi-fw pi-home', routerLink: ['/admin/dashboard'] } ]
            },

            {
                label: 'Users',
                items: [
                    { label: 'Staff', icon: 'pi pi-fw pi-user',routerLink: ['/admin/user/staff'] }, 
                    { label: 'House owners', icon: 'pi pi-fw pi-users',routerLink: ['/admin/user/house-owner'] }   
                    
             ]
            },
            {
                label: 'Plots Management',
                icon: 'pi pi-fw pi-briefcase',
                routerLink: ['/pages'],
                items: [
                    {
                        label: 'Plots',
                        icon: 'pi pi-users',
                        items: [
                            {
                                label: 'Area',
                                icon: 'pi pi-globe',
                                routerLink: ['/admin/area']
                            },
                            {
                                label: 'Block',
                                icon: 'pi pi-th-large',
                                routerLink: ['/admin/block']
                            },
                            {
                                label: 'Plots',
                                icon: 'pi pi-map',
                                routerLink: ['/admin/plot']
                            },
                            
                            
                        ]
                    },
                   
                    
                ]
            },

            {
                label: 'Billing',
                items: [
                    { label: 'Bills', icon: 'pi pi-fw pi-dollar',routerLink: ['/admin/bills'] },                    
             ]
            },
            {
                label: 'Complaints',
                items: [
                    { label: 'Complaints', icon: 'pi pi-fw pi-comments',routerLink: ['/admin/Complaints'] }
                   
             ]
            },
            {
                label: 'Events',
                items: [
                    { label: 'Events', icon: 'pi pi-fw pi-comments',routerLink: ['/admin/events'] }
                   
             ]
            },
            {
                label: 'Auth',
                icon: 'pi pi-fw pi-briefcase',
                routerLink: ['/pages'],
                items: [
                  
                                {
                                    label: 'Roles',
                                     icon: 'pi pi-shield',
                                    routerLink: ['/admin/auth/roles']
                                },
                                {
                                    label: 'Permission',
                                     icon: 'pi pi-fw pi-lock',
                                   routerLink: ['/admin/auth/permissions']
                               },
                    // {
                    //     label: 'Crud',
                    //     icon: 'pi pi-fw pi-pencil',
                    //     routerLink: ['/pages/crud']
                    // },
                    // {
                    //     label: 'Not Found',
                    //     icon: 'pi pi-fw pi-exclamation-circle',
                    //     routerLink: ['/user/notfound']
                    // },
                    // {
                    //     label: 'Empty',
                    //     icon: 'pi pi-fw pi-circle-off',
                    //     routerLink: ['/user/empty']
                    // }
                ]
            },

           
        ];
    }
}
