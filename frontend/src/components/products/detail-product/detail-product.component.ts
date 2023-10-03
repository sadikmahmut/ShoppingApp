import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/services/api/api.service';

@Component({
  selector: 'app-detail-product',
  templateUrl: './detail-product.component.html',
  styleUrls: ['./detail-product.component.scss']
})

export class DetailProductComponent implements OnInit {
  productId: string = '';
  product: any = {
    Name: '',
    Description: '',
    Price: 0.0,
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private apiService: ApiService
  ) {}

  ngOnInit(): void {
    this.apiService.getUserStatus().subscribe((userStatus) => {
      if (!userStatus.isSignedIn) {
        this.router.navigate(['/Login']);
      } else if (userStatus.isAdmin) {
        this.router.navigate(['']);
      } else {
        this.route.params.subscribe((params) => {
          this.productId = params['id'];

          this.apiService.getProduct(this.productId).subscribe({
            next: (data) => {
              this.product = data;
            },
            error: (error) => {
              console.error('Error fetching product:', error);
            },
          });
        });
      }
    });
  }
}
