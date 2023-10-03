import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from 'src/services/api/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})

export class RegisterComponent implements OnInit{

  registerForm: FormGroup;
  submitted: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private apiService: ApiService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.registerForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      address: [''],
      password: ['', Validators.required],
      reEnterPassword: ['', Validators.required],
    });

    this.apiService.isLoggedIn().subscribe((isLoggedIn) => {
      if (isLoggedIn) {
        this.router.navigate(['']);
      }
    });
  }

  get formFields() {
    return this.registerForm.controls;
  }

  onSubmit(): void {
    this.submitted = true;
    
    if (this.registerForm.invalid) {
      return;
    }
    
    if (this.formFields['password'].value !== this.formFields['reEnterPassword'].value) {
      console.error('Passwords do not match');
      return;
    }
    
    this.apiService.registerUser(this.registerForm.value).subscribe({
      next: (response) => {
        this.router.navigate(['/Login']);
      },
      error: (error) => {
        console.error('Registration failed:', error);
      }
    });
  }
}
