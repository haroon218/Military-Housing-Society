import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AccordionModule } from 'primeng/accordion';
import { DropdownModule } from 'primeng/dropdown';
import { LanguageService } from '../../../../services/language.service';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../../services/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [AccordionModule,DropdownModule,FormsModule,CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  languages: any[] = [];
  selectedLanguage: any;
  profileMenuVisible = false;
  profileOptions = [
      { label: 'View Profile', value: 'viewProfile' },
      { label: 'Logout', value: 'logout' }
  ];
  constructor(private languageService: LanguageService,private services:AuthService,private toastr:ToastrService) {}
  // constructor(private translate: TranslateService) {}

  ngOnInit(): void {
    // Define language options
    this.languages = [
      { label: 'English', value: 'en', icon: '/assets/uk.svg' },
      { label: 'Arabic', value: 'ar', icon: '/assets/sa.svg' }
    ];

    // Set default language based on your requirements
    this.selectedLanguage = this.languages[0]; // Default to English
    // this.translate.setDefaultLang('en');
  }

  onLanguageChange(lang: any): void {
    debugger
    this.languageService.switchLanguage(lang.value);
    this.selectedLanguage = lang;
  }

  toggleProfileMenu() {
    this.profileMenuVisible = !this.profileMenuVisible;
}

onProfileOptionChange(value: string) {
    if (value === 'viewProfile') {
        this.viewProfile();
    } else if (value === 'logout') {
        this.logout();
    }
    this.profileMenuVisible = false; // Hide the dropdown after selection
}

viewProfile() {
    // Your view profile logic here
}

logout() {
  this.services.logout().subscribe(
    response => {
      // Handle successful logout response
      this.toastr.success('Successfully logged out', 'Success');
      // Optionally navigate to login page here
      // this.router.navigate(['/login']);
    },
    error => {
      // Handle error response
      this.toastr.error('Logout failed. Please try again.', 'Error');
    }
  );
}
}

