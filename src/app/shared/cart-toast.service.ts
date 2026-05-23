import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Toast {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  private toasts: Toast[] = [];

  private toastSubject = new BehaviorSubject<Toast[]>([]);
  toasts$ = this.toastSubject.asObservable();

  show(
    message: string,
    type: 'success' | 'error' | 'info' | 'warning' = 'success'
  ) {

    const toast: Toast = {
      id: Date.now(),
      message,
      type
    };

    this.toasts.push(toast);
    this.toastSubject.next([...this.toasts]);

    setTimeout(() => {
      this.remove(toast.id);
    }, 3000);
  }

  remove(id: number) {
    this.toasts = this.toasts.filter(t => t.id !== id);
    this.toastSubject.next([...this.toasts]);
  }
}