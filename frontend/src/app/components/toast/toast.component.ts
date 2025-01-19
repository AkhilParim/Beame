import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="visible" 
         class="fixed bottom-4 right-4 bg-red-200 text-red-800 border border-red-400 px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in-up flex items-center">
      {{ message }}
    </div>
  `,
  styles: [`
    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    
    .animate-fade-in-up {
      animation: fadeInUp 0.3s ease-out;
    }
  `]
})
export class ToastComponent implements OnInit, OnDestroy {
  @Input() message: string = '';
  visible: boolean = true;
  private timeout: any;

  ngOnInit() {
    this.timeout = setTimeout(() => {
      this.visible = false;
    }, 3000);
  }

  ngOnDestroy() {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
  }
} 