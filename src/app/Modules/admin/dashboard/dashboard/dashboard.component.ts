import { Component } from '@angular/core';
import { ChartModule } from 'primeng/chart';
import { debounceTime, Subscription } from 'rxjs';
import { LayoutService } from '../../layout/service/layout.service';
import { SelectModule } from 'primeng/select';
import { FormsModule } from '@angular/forms';
import { SharedService } from '../../Shared/services/shared.service';

@Component({
  selector: 'app-dashboard',
  imports: [ChartModule,SelectModule,FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  chartData: any;
years: number[] = [];
months: any[] = [];
selectedYear: number = new Date().getFullYear();
selectedMonth?: number;
  chartOptions: any;
 totalAmount :any;
    paidAmount : any;
    paidCount : any;
    unpaidCount :any;
  subscription!: Subscription;

  constructor(public layoutService:LayoutService,private sharedService:SharedService) {
      this.subscription = this.layoutService.configUpdate$.pipe(debounceTime(25)).subscribe(() => {
          
      });
  }

  ngOnInit() {
   this.sharedService.sendGetRequest('/Dashboard/filters').subscribe((res:any) => {
    if(res.success){
    this.years = res.data.years;
    this.months = res.data.months;
    this.selectedYear = this.years[0];
    this.loadSummary();
    this.loadChart();
    }
  });
  }
loadSummary() {
  this.sharedService.sendGetRequest('/Dashboard/summary',[],{year:this.selectedYear, month:this.selectedMonth}).subscribe((summary:any) => {
    if(summary.success){
    this.totalAmount = summary.data.totalAmount;
    this.paidAmount = summary.data.paidAmount;
    this.paidCount = summary.data.paidCount;
    this.unpaidCount = summary.data.unpaidCount;
    }
  });
  
}
loadChart() {
  this.sharedService.sendGetRequest('/Dashboard/chart',[],{year:this.selectedYear,}).subscribe((data:any) => {
     if(data.success){
        debugger
    this.chartData = {
      labels: data.data.map((d: any) => d.monthName),
      datasets: [
        {
          type: 'bar',
          label: 'Paid Bills Amount ',
          backgroundColor: '#22c55e',
          data: data.data.map((d: any) => d.paidAmount),
          barThickness: 32
        },
        {
          type: 'bar',
          label: 'Unpaid Bills Amount',
          backgroundColor: '#ef4444',
          data: data.data.map((d: any) => d.unpaidAmount),
          barThickness: 32
        }
      ]
    };
}
  });
}

  ngOnDestroy() {
      if (this.subscription) {
          this.subscription.unsubscribe();
      }
  }
}
