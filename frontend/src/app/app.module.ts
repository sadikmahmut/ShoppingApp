import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { HomeComponent } from 'src/components/home/home.component';
import { NavbarComponent } from 'src/components/navbar/navbar.component';
import { SidebarComponent } from 'src/components/sidebar/sidebar.component';
import { ProductsComponent } from 'src/components/products/products.component';
import { AddProductComponent } from 'src/components/products/add-product/add-product.component';
import { EditProductComponent } from 'src/components/products/edit-product/edit-product.component';
import { LoginComponent } from 'src/components/login/login.component';
import { RegisterComponent } from 'src/components/register/register.component';
import { MyprofileComponent } from 'src/components/myprofile/myprofile.component';
import { OrdersComponent } from 'src/components/orders/orders.component';
import { DetailProductComponent } from 'src/components/products/detail-product/detail-product.component';
import { CreateUserComponent } from 'src/components/myprofile/create-user/create-user.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    SidebarComponent,
    ProductsComponent,
    AddProductComponent,
    EditProductComponent,
    DetailProductComponent,
    LoginComponent,
    RegisterComponent,
    MyprofileComponent,
    NavbarComponent,
    OrdersComponent,
    CreateUserComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    CommonModule,
    MatCardModule,
    FormsModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
