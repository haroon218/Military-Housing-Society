import { Component } from '@angular/core';

@Component({
    standalone: true,
    selector: 'app-footer',
    template: `<div class="layout-footer">
        Salvao by
        <a href="https://www.techbridgeconsultancy.com" target="_blank" rel="noopener noreferrer" class="text-primary font-bold hover:underline">TBC</a>
    </div>`
})
export class AppFooter {}
