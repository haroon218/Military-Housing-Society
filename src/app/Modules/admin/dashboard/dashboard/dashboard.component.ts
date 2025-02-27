import { Component } from '@angular/core';
import { ChartModule } from 'primeng/chart';
import { debounceTime, Subscription } from 'rxjs';
import { LayoutService } from '../../layout/service/layout.service';

@Component({
  selector: 'app-dashboard',
  imports: [ChartModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  chartData: any;

  chartOptions: any;

  subscription!: Subscription;

  constructor(public layoutService:LayoutService) {
      this.subscription = this.layoutService.configUpdate$.pipe(debounceTime(25)).subscribe(() => {
          this.initChart();
      });
  }

  ngOnInit() {
      this.initChart();
  }

  initChart() {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const borderColor = documentStyle.getPropertyValue('--surface-border');
    const textMutedColor = documentStyle.getPropertyValue('--text-color-secondary');

    this.chartData = {
        labels: ['Jan', 'Feb', 'March', 'Apr'],
        datasets: [
            {
                type: 'bar',
                label: 'Paid Bills',
                backgroundColor: documentStyle.getPropertyValue('--p-primary-400'),
                data: [5000, 12000, 18000, 6000], // Sample Paid Bills Data
                barThickness: 32
            },
            {
                type: 'bar',
                label: 'Unpaid Bills',
                backgroundColor: 'rgba(192, 53, 83, 0.98)',
                data: [3000, 5000, 7000, 4000], // Sample Unpaid Bills Data
                barThickness: 32
            }
        ]
    };

    this.chartOptions = {
        maintainAspectRatio: false,
        aspectRatio: 0.8,
        plugins: {
            legend: {
                labels: {
                    color: textColor
                }
            }
        },
        scales: {
            x: {
                stacked: true,
                ticks: {
                    color: textMutedColor
                },
                grid: {
                    color: 'transparent',
                    borderColor: 'transparent'
                }
            },
            y: {
                stacked: true,
                ticks: {
                    color: textMutedColor
                },
                grid: {
                    color: borderColor,
                    borderColor: 'transparent',
                    drawTicks: false
                }
            }
        }
    };
}


  ngOnDestroy() {
      if (this.subscription) {
          this.subscription.unsubscribe();
      }
  }
}
