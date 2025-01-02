import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {

  constructor(private translate: TranslateService,private toastr:ToastrService ) {
    const defaultLang = 'en';
    translate.setDefaultLang(defaultLang);
    // translate.use(browserLang.match(/en|ar/) ? browserLang : defaultLang);
  }

  switchLanguage(language: string): void {
    debugger
    this.translate.use(language);
    const message = this.translate.instant('LANGUAGE_CHANGE_SUCCESS');
    this.toastr.success(message, 'Success');
    document.documentElement.dir = (language === 'ar') ? 'rtl' : 'ltr';
    if (language === 'ar') {
      document.body.classList.add('rtl');
    } else {
      document.body.classList.remove('rtl');
    }
  }
  

  getCurrentLanguage(): string {
    return this.translate.currentLang || 'en';
  }}
