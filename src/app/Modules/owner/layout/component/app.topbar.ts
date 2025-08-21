import { Component, inject, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { StyleClassModule } from 'primeng/styleclass';
import { LayoutService } from '../service/layout.service';
import { OverlayModule } from 'primeng/overlay';
import { SharedService } from '../service/shared.service';


@Component({
    selector: 'app-topbar',
    standalone: true,
    imports: [RouterModule, CommonModule, StyleClassModule,OverlayModule],
    template: ` <div class="layout-topbar">
        <div class="layout-topbar-logo-container">
            <button class="layout-menu-button layout-topbar-action" (click)="layoutService.onMenuToggle()">
                <i class="pi pi-bars"></i>
            </button>
            
            <a class="layout-topbar-logo" routerLink="/">
                <img src="/assets/images/logo.jpeg" alt="Logo" loading="lazy" style="max-height: 30px;">
                
                
                <span>MACHS</span>
            </a>
        </div>

        <div class="layout-topbar-actions">
            <div class="layout-config-menu">
                <button type="button" class="layout-topbar-action" (click)="toggleDarkMode()">
                    <i [ngClass]="{ 'pi ': true, 'pi-moon': layoutService.isDarkTheme(), 'pi-sun': !layoutService.isDarkTheme() }"></i>
                </button>
                <div class="relative">
                    <!-- <button
                        class="layout-topbar-action layout-topbar-action-highlight"
                        pStyleClass="@next"
                        enterFromClass="hidden"
                        enterActiveClass="animate-scalein"
                        leaveToClass="hidden"
                        leaveActiveClass="animate-fadeout"
                        [hideOnOutsideClick]="true"
                    >
                        <i class="pi pi-palette"></i>
                    </button> -->
                </div>
            </div>

            <!-- <button class="layout-topbar-menu-button layout-topbar-action" pStyleClass="@next" enterFromClass="hidden" enterActiveClass="animate-scalein" leaveToClass="hidden" leaveActiveClass="animate-fadeout" [hideOnOutsideClick]="true">
                <i class="pi pi-ellipsis-v"></i>
            </button> -->

            <div class="layout-topbar-menu hidden lg:block">
                <div class="layout-topbar-menu-content">
                    <!-- <button type="button" class="layout-topbar-action">
                        <i class="pi pi-calendar"></i>
                        <span>Calendar</span>
                    </button>
                    <button type="button" class="layout-topbar-action">
                        <i class="pi pi-inbox"></i>
                        <span>Messages</span>
                    </button> -->
                    <button type="button" class="layout-topbar-action" (click)="toggle()">
                        <i class="pi pi-user"></i>
                        <span>Profile</span>
                    </button>
                    <p-overlay [(visible)]="overlayVisible" [responsive]="{ breakpoint: '640px', direction: 'bottom', contentStyleClass: 'h-20rem' }" contentStyleClass="p-4 bg-surface-0 dark:bg-surface-900 shadow rounded-border">
                    <div class="d-flex cursor-pointer">
                        @if(LoginUserData) {
                          <span class="text-sm text-muted-color font-semibold">{{LoginUserData.name}}</span>
                        }
                    </div>
                    <div class="d-flex cursor-pointer mt-2">
                        <!-- <i class="pi pi-sign-out mr-2"></i>  -->
                        <span class="text-sm text-muted-color font-semibold" (click)="logout()">Logout</span>
                    </div>
                    </p-overlay>
                </div>
            </div>
        </div>
    </div>`
})
export class AppTopbar implements OnInit{
    private sharedService=inject(SharedService)
    items!: MenuItem[];
    LoginUserData:any={}
    constructor(public layoutService: LayoutService,private router:Router) {}

    toggleDarkMode() {
        this.layoutService.layoutConfig.update((state) => ({ ...state, darkTheme: !state.darkTheme }));
    }

    overlayVisible: boolean = false;

    toggle() {
        this.overlayVisible = !this.overlayVisible;
    }

    ngOnInit(): void {
        this.sharedService.sharedData$.subscribe((res:any) => {
            
           this.LoginUserData = res ;
        })
    }

    logout(){
        localStorage.removeItem("Data@Salvao");
       this.router.navigate(['/login'])
    }

}
