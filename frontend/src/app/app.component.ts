import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/services/api/api.service';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit {
  title = 'Shopping App';

  constructor(
    private apiService: ApiService, 
    private router: Router,
    private cookieService: CookieService) {}

  ngOnInit(): void {
    // Check if the user is authenticated
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

    // Update the authentication status
    this.apiService.updateLoginStatus(isLoggedIn);

    // Check for the JWT token cookie
    const jwtToken = this.cookieService.get('jwtToken');

    // If a JWT token cookie is found, set it as the authorization token
    if (jwtToken) {
      this.apiService.setAuthToken(jwtToken);
    }
  }
}
