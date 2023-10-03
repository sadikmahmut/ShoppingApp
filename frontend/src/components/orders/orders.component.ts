import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/services/api/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})

export class OrdersComponent implements OnInit {
  orders: any[] = [];
  userId: any;
  isAdmin: boolean = false;

  constructor(private apiService: ApiService, private router: Router) {}


  ngOnInit(): void {
    this.apiService.getUserStatus().subscribe((userStatus) => {
      if (userStatus.isSignedIn) {
        if (userStatus.isAdmin) {
          this.isAdmin = true;
          this.apiService.getAllOrders().subscribe({
            next: (data) => {
              this.orders = data;
            },
            error: (error) => {
              console.error('Error fetching orders:', error);
            }
          });
        } else {
          this.apiService.getLoggedInUser().subscribe((user) => {
            if (user && user.Id) {
              this.userId = user.Id;
              this.apiService.getOrdersByUserId(this.userId).subscribe({
                next: (data) => {
                  this.orders = data;
                },
                error: (error) => {
                  console.error('Error fetching user orders:', error);
                }
              });
            } else {
              console.error('User Id not found');
            }
          });
        }
      } else {
        this.router.navigate(['/Login']);
      }
    });
  }
}