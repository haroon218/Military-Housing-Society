import { Component, ElementRef, EventEmitter, Input, Output, SimpleChanges, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { UserService } from '../service/user.service';
import { FormsModule } from '@angular/forms';
import { ImageModule } from 'primeng/image';
import { CardModule } from 'primeng/card';
import { ToolbarModule } from 'primeng/toolbar';
import { DialogModule } from 'primeng/dialog';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-therapist-detail',
  imports: [
    CommonModule,
    DropdownModule,
    ButtonModule,
    FormsModule,
    ImageModule,
    CardModule,
    ToolbarModule,
    DialogModule
  ],
  templateUrl: './therapist-detail.component.html',
  styleUrl: './therapist-detail.component.scss'
})
export class TherapistDetailComponent {
  @Input() showPrintView = false; // Receive flag from parent
  @Output() closePrint = new EventEmitter<void>(); // Notify parent when done
  @ViewChild('invoiceCont', { static: false }) invoiceCont!: ElementRef;
@Input() billData: any; // receive the API data

  customerName = 'AOSA KAMRAN';
  customerAddress = '241, MACHSA, A BLOCK, MILITARY ACCOUNTS COOPERATIVE HOUSING SOCIETY';
  customerId = 'MCH-230222-276';
  referenceNo = 'IMACHS12025';

  // Billing Details
  billingMonth = 'DECEMBER 2025';
  deferredAmount = '0.00';
  arrears = '1950.00';
  currentBill = '1500.00';
  pendingAmount = '3900.00';
  dueDate = '10/01/2025';
  payableOnDueDate = '3450.00';
  payableAfterDueDate = '3900.00';

  // Billing History
  billingHistory = [
    { month: 'DECEMBER', bill: 'NIL', receiptId: '1500.00', paidDate: '1/6/2024', payment: 'PAID' },
    { month: 'JANUARY', bill: 'NIL', receiptId: '1500.00', paidDate: '2/8/2024', payment: 'PAID' },
    { month: 'FEBRUARY', bill: 'NIL', receiptId: '1500.00', paidDate: '3/1/2024', payment: 'PAID' },
    { month: 'MARCH', bill: 'NIL', receiptId: '1500.00', paidDate: '4/2/2024', payment: 'PAID' },
    { month: 'APRIL', bill: 'NIL', receiptId: '1500.00', paidDate: '5/10/2024', payment: 'PAID' },
    { month: 'MAY', bill: 'NIL', receiptId: '1500.00', paidDate: '6/7/2024', payment: 'PAID' },
    { month: 'JUNE', bill: 'NIL', receiptId: '1500.00', paidDate: '7/9/2024', payment: 'PAID' },
    { month: 'JULY', bill: 'NIL', receiptId: '1500.00', paidDate: '8/10/2024', payment: 'PAID' },
    { month: 'AUGUST', bill: '15113', receiptId: '1500.00', paidDate: '9/10/2024', payment: 'PAID' },
    { month: 'SEPTEMBER', bill: '15782', receiptId: '1500.00', paidDate: '10/2/2024', payment: 'PAID' },
    { month: 'OCTOBER', bill: 'NIL', receiptId: '1550.00', paidDate: 'NIL', payment: 'OVER DUE' },
    { month: 'NOVEMBER', bill: '310401', receiptId: '1500.00', paidDate: '12/10/2024', payment: 'PAID' }
  ];

  // Contact Information
  complaintOffice = '042 35965786';
  onlineBankAccount = 'PK50ASCMM003201650001200';
  billingEmail = 'Billing@Militaryaccountschs.Com';
  ngOnChanges(changes: SimpleChanges) {
    debugger
    if (changes['showPrintView'] && this.showPrintView && this.billData) {
      setTimeout(() => { // Ensure DOM is rendered before accessing ViewChild
        this.printFunct();
      }, 0);
    }
  }

  printFunct() {
    debugger

    if (!this.invoiceCont) {
      console.error('Invoice content is not available');
      return;
    }

    const printContents = this.invoiceCont.nativeElement.innerHTML;

    if (!printContents) {
      console.error('No invoice content to print');
      return;
    }
 
    
    // Create a new window for printing
    const popupWindow = window.open('','_blank', 'width=700,height=600');

    // Write the content to the new window and add print styles
    if (popupWindow) {

      popupWindow.document.open();

      // Copy styles from the document
      const styles = Array.from(document.styleSheets)
        .map((styleSheet) => {
          try {
            return Array.from(styleSheet.cssRules)
              .map((rule) => rule.cssText)
              .join('');
          } catch (e) {
            return '';
          }
        })
        .join('');

      // Write all collected invoice content to the window with page breaks
      popupWindow.document.write(`
        <html>
          <head>
            <title>Print Invoices</title>
            <style>
              ${styles}
            </style>
          </head>
          <body class="printStyling" onload="window.print();window.close()">
          <div class="invoice">
            ${printContents}
          </div>
          
          </body>
        </html>
      `);
      popupWindow.document.close();

    }
    this.closePrint.emit();
  }

}