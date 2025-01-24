import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastState } from '../../services/toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="visible" 
         [class]="getToastClasses()"
         class="border fixed right-4 px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in flex items-center">
       {{ message }} <!-- TODO: add icon -->
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
  @Input() state: ToastState = 'info';
  visible: boolean = true;
  private timeout: any;

  getToastClasses(): string {
    switch (this.state) {
      case 'success':
        return `bottom-4 bg-green-200 text-green-800 border-green-400`;
      case 'error':
        return `top-4 bg-red-200 text-red-800 border-red-400`;
      case 'info':
      default:
        return `bottom-4 bg-blue-200 text-blue-800 border-blue-400`;
    }
  }

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