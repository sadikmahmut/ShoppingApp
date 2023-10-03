import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from 'src/services/api/api.service';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup; 
  submitted: boolean = false; 

  invalidUsernameError: string = '';
  invalidPasswordError: string = '';

  constructor(
    private formBuilder: FormBuilder,
    private apiService: ApiService,
    private cookieService: CookieService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required], 
      password: ['', Validators.required]  
    });

    this.apiService.isLoggedIn().subscribe((isLoggedIn) => {
      if (isLoggedIn) {
        this.router.navigate(['']);
      }
    });
  }

  get formFields() {
    return this.loginForm.controls;
  }

  onSubmit(): void {
    this.submitted = true;
    if (this.loginForm.invalid) {
      return; 
    }

    this.apiService.loginUser(this.formFields['username'].value, this.formFields['password'].value).subscribe({
      next: (response) => {

        this.cookieService.set('jwtToken', response.token);
        localStorage.setItem('isLoggedIn', 'true'); 
        this.apiService.setAuthToken(response.token);

        this.router.navigate(['']);
      },
      error: (error) => {
        console.error('Login failed:', error);

        if (error.error && error.error.error === 'Invalid username') {
          this.invalidUsernameError = 'Invalid username';
          this.invalidPasswordError = '';
        } else if (error.error && error.error.error === 'Invalid password') {
          this.invalidUsernameError = '';
          this.invalidPasswordError = 'Invalid password';
        } else {
          this.invalidUsernameError = 'An error occurred during login.';
          this.invalidPasswordError = '';
        }
      }
    });
  }
}
