import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { AccordionModule } from 'primeng/accordion';

@Component({
  selector: 'app-side-bar',
  standalone: true,
  imports: [AccordionModule,RouterModule,TranslateModule],
  templateUrl: './side-bar.component.html',
  styleUrl: './side-bar.component.css'
})
export class SideBarComponent {
   toggleSidebar() {
    const sidebar:any = document.querySelector('.sidebar');
    sidebar.classList.toggle('show'); 
}
activeTab: string | null = null;

  setActiveTab(tabName: string) {
    this.activeTab = this.activeTab === tabName ? null : tabName;
  }
}
