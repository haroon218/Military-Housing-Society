import { Component } from '@angular/core';

@Component({
    standalone: true,
    selector: 'app-footer',
    template: `<div class="layout-footer">
        MACHS by
        <a  target="_blank" rel="noopener noreferrer" class="text-primary font-bold hover:underline">Stuck off's</a>
    </div>`
})
export class AppFooter {}
