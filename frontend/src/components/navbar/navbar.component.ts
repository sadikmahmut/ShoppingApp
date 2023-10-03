import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ApiService } from 'src/services/api/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})

export class NavbarComponent implements OnInit {
  isLoggedIn: boolean = false;
  isAdmin: boolean = false;

  constructor(
    private apiService: ApiService, 
    private router: Router, 
    private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.apiService.isLoggedIn().subscribe({
      next: (isLoggedIn) => {
        this.isLoggedIn = isLoggedIn;
      },
      error: (error) => {
        console.error('Error checking login status:', error);
      }
    });
  }

  logout(): void {
    this.apiService.logout();
    this.router.navigate(['']);
  }
}