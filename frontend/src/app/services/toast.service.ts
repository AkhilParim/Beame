import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type ToastState = 'error' | 'success' | 'info';

interface ToastMessage {
  text: string;
  state: ToastState;
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private messageSubject = new BehaviorSubject<ToastMessage | null>(null);
  message$ = this.messageSubject.asObservable();

  showToast(message: string, state: ToastState = 'info') {
    // Reset the message first to handle consecutive identical messages
    this.messageSubject.next(null);
    setTimeout(() => {
      this.messageSubject.next({ text: message, state });
    }, 100);
  }
} 