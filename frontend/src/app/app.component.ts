import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToastComponent } from './components/toast/toast.component';
import { ToastService } from './services/toast.service';
import { AsyncPipe, CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ToastComponent, AsyncPipe, CommonModule],
  template: `
    <router-outlet />
    <app-toast 
      *ngIf="toastService.message$ | async as message" 
      [message]="message.text"
      [state]="message.state" />
  `
})
export class AppComponent {
  constructor(public toastService: ToastService) {}
}
