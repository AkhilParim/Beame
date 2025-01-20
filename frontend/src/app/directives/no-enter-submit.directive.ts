import { Directive, HostListener } from '@angular/core';

// This directive is used to prevent the enter key from submitting the form
@Directive({
  selector: 'form:not([allowEnterSubmit])',  // Applies to all forms except those with allowEnterSubmit attribute
  standalone: true
})
export class NoEnterSubmitDirective {
  @HostListener('keydown.enter', ['$event'])
  onKeydownHandler(event: KeyboardEvent) {
    if (event.target instanceof HTMLTextAreaElement) return; // Allow enter in textareas
    event.preventDefault();
  }
} 