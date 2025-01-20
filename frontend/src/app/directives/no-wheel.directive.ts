import { Directive, ElementRef, OnInit } from '@angular/core';

// This directive is used to prevent the mouse wheel from scrolling the input field
@Directive({
  selector: 'input[type="number"]',
  standalone: true
})
export class NoWheelDirective implements OnInit {
  constructor(private el: ElementRef) {}

  ngOnInit() {
    this.el.nativeElement.addEventListener('wheel', (e: WheelEvent) => {
      e.preventDefault();
    });
  }
} 