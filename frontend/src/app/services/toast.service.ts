import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private messageSubject = new BehaviorSubject<string>('');
  message$ = this.messageSubject.asObservable();

  showToast(message: string) {
    // Reset the message first to handle consecutive identical messages
    this.messageSubject.next('');
    setTimeout(() => {
      this.messageSubject.next(message);
    }, 100);
  }
} 