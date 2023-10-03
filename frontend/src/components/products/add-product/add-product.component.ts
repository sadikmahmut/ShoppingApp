import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from 'src/services/api/api.service';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.scss']
})

export class AddProductComponent implements OnInit {

  product: any = {
    Name: '',
    Description: '',
    Price: 0.0,
  };

  editProductForm: FormGroup;
  submitted: boolean = false;

  constructor(
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

    this.apiService.createProduct(this.product).subscribe({
      next: (data) => {
        this.router.navigate(['/Products']);
      },
      error: (error) => {
        console.error('Error creating product:', error);
      }
    });
  }
}