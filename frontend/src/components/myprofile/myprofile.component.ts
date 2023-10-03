import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/services/api/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-myprofile',
  templateUrl: './myprofile.component.html',
  styleUrls: ['./myprofile.component.scss']
})

export class MyprofileComponent implements OnInit {
  loggedInUser: any;
  isAdmin: boolean = false;

  constructor(private apiService: ApiService, private router: Router) {}
  
  ngOnInit(): void {
    this.apiService.getUserStatus().subscribe((userStatus) => {
      this.isAdmin = userStatus.isAdmin;
      if (userStatus.isSignedIn) {
        this.apiService.getLoggedInUser().subscribe({
          next: (user) => {
            this.loggedInUser = user;
          },
          error: (error) => {
            console.error('Error retrieving logged-in user:', error);
          }
        });
      } else {
        this.router.navigate(['/Login']);
      }
    });
  }
}