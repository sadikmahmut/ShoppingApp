import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from 'src/components/home/home.component';
import { AddProductComponent } from 'src/components/products/add-product/add-product.component';
import { MyprofileComponent } from 'src/components/myprofile/myprofile.component';
import { ProductsComponent } from 'src/components/products/products.component';
import { EditProductComponent } from 'src/components/products/edit-product/edit-product.component';
import { DetailProductComponent } from 'src/components/products/detail-product/detail-product.component';
import { LoginComponent } from 'src/components/login/login.component';
import { RegisterComponent } from 'src/components/register/register.component';
import { OrdersComponent } from 'src/components/orders/orders.component';
import { CreateUserComponent } from 'src/components/myprofile/create-user/create-user.component';

const routes: Routes = [
  { path: '', component: HomeComponent }, // both
  { path: 'MyProfile', component: MyprofileComponent }, // customer
  { path: 'Products', component: ProductsComponent }, // customer
  { path: 'AddProduct', component: AddProductComponent }, // admin
  { path: 'EditProduct/:id', component: EditProductComponent }, // admin
  { path: 'DetailProduct/:id', component: DetailProductComponent }, // customer
  { path: 'Login', component: LoginComponent }, // none
  { path: 'Register', component: RegisterComponent }, // none
  { path: 'Orders', component: OrdersComponent }, // both ??
  { path: 'CreateUser', component: CreateUserComponent }, // admin
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
