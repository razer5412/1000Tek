import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService, Toast } from '../cart-toast.service';

@Component({
  selector: 'app-cart-toast',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cart-toast.html',
  styleUrls: ['./cart-toast.css']
})
export class CartToastComponent {

  toasts: Toast[] = [];

  constructor(private toastService: ToastService) {

    this.toastService.toasts$.subscribe(data => {
      this.toasts = data;
    });

  }

  remove(id: number) {
    this.toastService.remove(id);
  }
}