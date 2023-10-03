import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/services/api/api.service';

@Component({
  selector: 'app-edit-product',
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.scss']
})

export class EditProductComponent implements OnInit {
  productId: string = '';
  product: any = {
    Name: '',
    Description: '',
    Price: 0.0,
  };

  editProductForm: FormGroup;
  submitted: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private apiService: ApiService,
    private formBuilder: FormBuilder 
  ) {}

  ngOnInit(): void {
    this.apiService.getUserStatus().subscribe((userStatus) => {
      if (!userStatus.isSignedIn) {
        this.router.navigate(['/Login']);
      } else if (!userStatus.isAdmin) {
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

    this.editProductForm = this.formBuilder.group({
      Name: ['', Validators.required],
      Description: ['', Validators.required],
      Price: [0.0, [Validators.required, Validators.min(0.01)]],
    });
  }

  get formFields() {
    return this.editProductForm.controls;
  }

  onSubmit(): void {
    this.submitted = true;

    if (this.editProductForm.invalid) {
      return;
    }

    this.product = this.editProductForm.value;

    this.apiService.updateProduct(this.productId, this.product).subscribe(
      (data: any) => {
        this.router.navigate(['/Products']);
      },
      (error: any) => {
        console.error('Error updating product:', error);
      }
    );
  }
}