import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/services/api/api.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
})

export class ProductsComponent implements OnInit {
  products: any[] = [];
  userStatus: { isSignedIn: boolean; isAdmin: boolean };

  constructor(private apiService: ApiService, private router: Router) {}

  ngOnInit(): void {
    this.apiService.getUserStatus().subscribe((status) => {
      this.userStatus = status;

      if (this.userStatus.isSignedIn) {
        this.fetchProducts();
      } else {
        this.router.navigate(['/Login']);
      }
    });
  }

  private fetchProducts(): void {
    this.apiService.getAllProducts().subscribe({
      next: (data) => {
        this.products = data;
      },
      error: (error) => {
        console.error('Error fetching products:', error);
      }
    });
  }

  deleteProduct(productId: string): void {
    if (confirm('Are you sure you want to delete this product?')) {
      this.apiService.deleteProduct(productId).subscribe({
        next: (data) => {
          this.loadProducts();
        },
        error: (error) => {
          console.error('Error deleting product:', error);
        }
      });
    }
  }

  orderProduct(productId: string): void {
    this.apiService.getLoggedInUser().subscribe({
      next: (user) => {
        if (user && user.Id) {
          this.apiService.orderProduct(user.Id, productId).subscribe({
            next: (data) => {
              this.router.navigate(['/Orders']);
            },
            error: (error) => {
              console.error('Error ordering product:', error);
            }
          });
        } else {
          console.error('User Id not found.');
        }
      },
      error: (error) => {
        console.error('Error fetching logged-in user:', error);
      }
    });
  }

  private loadProducts(): void {
    this.apiService.getAllProducts().subscribe({
      next: (data) => {
        this.products = data;
      },
      error: (error) => {
        console.error('Error fetching products:', error);
      }
    });
  }

} 
