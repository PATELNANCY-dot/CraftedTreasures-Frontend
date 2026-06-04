import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-order-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './order-list.html',
  styleUrls: ['./order-list.css']
})
export class OrderList {

  selectedOrder: any = null;
  showModal: boolean = false;
  searchText: string = '';

  orders: any[] = [];

  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    console.log('OrderList component loaded');
    this.getOrders();
  }


  getOrders() {
    this.http.get<any[]>('https://localhost:7107/api/Admin/GetOrdersWithItems')
      .subscribe({
        next: (res) => {

          // Sort latest orders first
          this.orders = res.sort((a, b) =>
            new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime()
          );

          console.log('Orders Loaded:', this.orders);
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.log('Orders API Error:', err);
        }
      });
  }

  openOrder(order: any) {

    const orderId = order?.orderId ?? order?.OrderId;

    if (!orderId) {
      console.log('OrderId missing');
      return;
    }

    // 1. Open modal first
    this.showModal = true;

    // 2. Set basic order immediately
    this.selectedOrder = {
      ...order,
      items: []
    };

    // 3. Force UI update immediately
    this.cdr.detectChanges();

    // 4. Call API
    this.http.get<any[]>(
      `https://localhost:7107/api/Admin/GetOrderItemsWithProductDetails/${orderId}`
    ).subscribe({
      next: (res) => {

        console.log('Items received:', res);

        // 5. Update data
        this.selectedOrder.items = res;

        // 6. Force UI refresh again
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.log('Order Items API Error:', err);
      }
    });
  }

  //  CLOSE MODAL
  closeModal() {
    this.showModal = false;
    this.selectedOrder = null;
  }



  searchOrder() {

    if (this.searchText.trim() === '') {
      this.getOrders();
      return;
    }

    const api =
      `https://localhost:7107/api/Admin/SearchOrders?keyword=${this.searchText}`;

    this.http.get<any[]>(api).subscribe({
      next: (res) => {

        console.log('Search Orders:', res);

        // keep same sorting like original list
        this.orders = res.sort((a, b) =>
          new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime()
        );

        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Search Error:', err);
      }
    });
  }
}
