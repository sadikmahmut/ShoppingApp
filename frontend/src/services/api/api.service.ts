import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject  } from 'rxjs';
import { tap } from 'rxjs/operators';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})

export class ApiService {

  private httpOptions: { headers: HttpHeaders };
  private isLoggedInSubject = new BehaviorSubject<boolean>(false); 

  constructor(private http: HttpClient, private cookieService: CookieService) { }
  baseUrl = 'http://localhost:3000/api';


  /******************************* Register *******************************/

  registerUser(user: any): Observable<any> {
    const apiUrl = `${this.baseUrl}/Register/registerUser`;
    return this.http.post(apiUrl, user);
  }

  /************************************************************************/

  /******************************** Login *********************************/

  loginUser(username: string, password: string): Observable<any> {
    const apiUrl = `${this.baseUrl}/Login/login`;
    const credentials = { username, password };
    return this.http.post(apiUrl, credentials, this.httpOptions)
      .pipe(
        tap(() => this.updateLoginStatus(true)), // Update login status on successful login
      );
  }

  setAuthToken(token: string): void {
    // Create an instance of HttpHeaders
    const headers = new HttpHeaders({
      'Authorization': token
    });

    // Set httpOptions with the HttpHeaders instance
    this.httpOptions = { headers };
  }

  logout(): void {
    // Remove the JWT token from the cookie
    this.cookieService.delete('jwtToken');
  
    // Clear the localStorage flag
    localStorage.removeItem('isLoggedIn');
  
    // Remove the token from the HTTP headers
    this.httpOptions = { headers: new HttpHeaders() };
  
    // Update login status on logout
    this.updateLoginStatus(false);
  }

  /************************************************************************/
 
  /********************************* User *********************************/

  updateLoginStatus(isLoggedIn: boolean) {
    this.isLoggedInSubject.next(isLoggedIn);
  }

  isLoggedIn(): Observable<boolean> {
    return this.isLoggedInSubject.asObservable();
  }
  
  getLoggedInUser(): Observable<any> {
    const apiUrl = `${this.baseUrl}/User/getUser`;
    return this.http.get(apiUrl, this.httpOptions);
  }

  getUserStatus(): Observable<{ isSignedIn: boolean; isAdmin: boolean }> {
    return new Observable((observer) => {
      // Check if the user is signed in
      this.isLoggedIn().subscribe((isSignedIn) => {
        if (isSignedIn) {
          // If the user is signed in, fetch user data to determine admin status
          this.getLoggedInUser().subscribe((user) => {
            if (user && user.Role === 'admin') {
              // User is signed in and is an admin
              observer.next({ isSignedIn: true, isAdmin: true });
            } else {
              // User is signed in but not an admin
              observer.next({ isSignedIn: true, isAdmin: false });
            }
            observer.complete();
          });
        } else {
          // User is not signed in
          observer.next({ isSignedIn: false, isAdmin: false });
          observer.complete();
        }
      });
    });
  }

  /************************************************************************/
  
  /******************************* Products *******************************/

  getAllProducts(): Observable<any[]> {
    const apiUrl = `${this.baseUrl}/Product/getAllProducts`;
    return this.http.get<any[]>(apiUrl, this.httpOptions);
  }

  getProduct(id: string): Observable<any> {
    const apiUrl = `${this.baseUrl}/Product/getProduct/${id}`;
    return this.http.get<any>(apiUrl, this.httpOptions);
  }

  createProduct(productData: any): Observable<any> {
    const apiUrl = `${this.baseUrl}/Product/createProduct`;
    return this.http.post(apiUrl, productData, this.httpOptions);
  }

  updateProduct(id: string, productData: any): Observable<any> {
    const apiUrl = `${this.baseUrl}/Product/updateProduct/${id}`;
    return this.http.put(apiUrl, productData, this.httpOptions);
  }

  deleteProduct(id: string): Observable<any> {
    const apiUrl = `${this.baseUrl}/Product/deleteProduct/${id}`;
    return this.http.put(apiUrl, {}, this.httpOptions);
  }

  orderProduct(userId: string, productId: string): Observable<any> {
    const apiUrl = `${this.baseUrl}/Product/orderProduct`;
    const orderData = { userId, productId };
    return this.http.post(apiUrl, orderData, this.httpOptions);
  }

  /************************************************************************/

  /******************************** Orders ********************************/

  getAllOrders(): Observable<any[]> {
    const apiUrl = `${this.baseUrl}/Order/getAllOrders`;
    return this.http.get<any[]>(apiUrl, this.httpOptions);
  }

  getOrdersByUserId(userId: string): Observable<any[]> {
    const apiUrl = `${this.baseUrl}/Order/getOrdersByUserId/${userId}`;
    return this.http.get<any[]>(apiUrl, this.httpOptions);
  }

  /************************************************************************/

}
