import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { ProgressBarModule } from 'primeng/progressbar';
import { Table, TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { AdminModule } from "../../../admin.module";
import { Router, RouterModule } from '@angular/router';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { MenuItem } from 'primeng/api';
@Component({
  selector: 'app-customers-list',
  standalone: true,
  imports: [TableModule,DropdownModule, CommonModule, InputTextModule, TagModule, FormsModule,BreadcrumbModule,
    DropdownModule, MultiSelectModule, ProgressBarModule, ButtonModule, AdminModule,RouterModule],  templateUrl: './customers-list.component.html',
  styleUrl: './customers-list.component.css'
})
export class CustomersListComponent {

  items: MenuItem[] | undefined;

  home: MenuItem | undefined;
customers: any[] = [
  {
    id: 1,
    name: 'Company One',
    country: { code: 'us', name: 'United States' },
    representative: { name: 'John Doe', image: 'amyelsner.png' },
    date: '2023-09-15',
    balance: 1200.5,
    activity: 80,
    verified: true,
  },
  {
    id: 2,
    name: 'Company Two',
    country: { code: 'ca', name: 'Canada' },
    representative: { name: 'Jane Smith', image: 'annafali.png' },
    date: '2023-08-30',
    balance: 900.0,
    activity: 60,
    verified: false,
  },
  {
    id: 3,
    name: 'Company Three',
    country: { code: 'fr', name: 'France' },
    representative: { name: 'Pierre Dupont', image: 'bernardodominic.png' },
    date: '2023-07-12',
    balance: 4500.75,
    activity: 95,
    verified: true,
  },
  {
    id: 4,
    name: 'Company Four',
    country: { code: 'de', name: 'Germany' },
    representative: { name: 'Hans Müller', image: 'elwinsharvill.png' },
    date: '2023-06-21',
    balance: 320.0,
    activity: 50,
    verified: false,
  },
  {
    id: 5,
    name: 'Company Five',
    country: { code: 'jp', name: 'Japan' },
    representative: { name: 'Yuki Yamamoto', image: 'ivanmagalhaes.png' },
    date: '2023-05-10',
    balance: 7800.25,
    activity: 70,
    verified: true,
  }
];

representatives: any[] = [
  { name: 'John Doe', image: 'amyelsner.png' },
  { name: 'Jane Smith', image: 'annafali.png' },
  { name: 'Pierre Dupont', image: 'bernardodominic.png' },
  { name: 'Hans Müller', image: 'elwinsharvill.png' },
  { name: 'Yuki Yamamoto', image: 'ivanmagalhaes.png' }
];

loading: boolean = false;

dropdownOptions = [
  { label: 'Option 1', id: 'option1' },
  { label: 'Option 2', id: 'option2' },
  { label: 'Option 3', id: 'option3' },
];

selectedOption!: string;

statuses!: any[];


activityValues: number[] = [0, 100];

searchValue: string | undefined;

constructor(private router:Router) {}

ngOnInit() {
  this.items = [{ icon: 'pi pi-home', route: '/installation' }, { label: 'User Management' }, { label: 'Customer list' }];
  

    
}

clear(table: Table) {
    table.clear();
    this.searchValue = ''
}

getSeverity(status: string):any {
    switch (status.toLowerCase()) {
        case 'unqualified':
            return 'danger';

        case 'qualified':
            return 'success';

        case 'new':
            return 'info';

        case 'negotiation':
            return 'warning';

        case 'renewal':
            return null;
    }
}
valueChange(event:any){
  debugger
  const value=event.value
}
navigateToViewList(id: string): void {
  this.router.navigate(['admin/user-management/customer-view']);
}
}

