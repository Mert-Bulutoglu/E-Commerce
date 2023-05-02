import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { NotFoundComponent } from './core/not-found/not-found.component';
import { ServerErrorComponent } from './core/server-error/server-error.component';
import { TestErrorComponent } from './core/test-error/test-error.component';
import { HomeComponent } from './home/home.component';
import { ProductComponent } from './product/product.component';
import { UserComponent } from './user/user.component';
import { UserDetailsComponent } from './user/user-details/user-details.component';
import { ProductDetailsComponent } from './product/product-details/product-details.component';
import { TypeComponent } from './type/type.component';
import { BrandComponent } from './brand/brand.component';
import { DeliveryMethodComponent } from './delivery-method/delivery-method.component';
import { DeliveryMethodDetailsComponent } from './delivery-method/delivery-method-details/delivery-method-details.component';
import { AllOrderComponent } from './all-order/all-order.component';
import { AllOrderDetailComponent } from './all-order/all-order-detail/all-order-detail.component';
import { RoleGuard } from './core/guards/role.guard';
import { UnauthorizedComponent } from './unauthorized/unauthorized.component';

const routes: Routes = [
  {path: '', title: 'EAT|YOUR|PROTEIN', component: HomeComponent},
  {path: 'test-error', title: 'Test-error', component: TestErrorComponent},
  {path: 'server-error', title: 'Sest-error', component: ServerErrorComponent},
  {path: 'not-found', title: 'Not-found', component: NotFoundComponent},
  {path: 'shop', title: 'Shop', loadChildren: () => import('./shop/shop.module').then(mod => mod.ShopModule)},
  {path: 'basket', title: 'Basket', loadChildren: () => import('./basket/basket.module').then(mod => mod.BasketModule)},
  {path: 'checkout', title: 'Checkout', canActivate:[AuthGuard], loadChildren: () => import('./checkout/checkout.module').then(mod => mod.CheckoutModule)},
  {path: 'orders', title: 'Order', canActivate:[AuthGuard], loadChildren: () => import('./orders/orders.module').then(mod => mod.OrdersModule)},
  {path: 'account', title: 'Account', loadChildren: () => import('./account/account.module').then(mod => mod.AccountModule)},
  {path: 'product/:id', title: 'Product', component: ProductDetailsComponent ,canActivate:[RoleGuard]},
  {path: 'create-product', title: 'Product', component: ProductDetailsComponent ,canActivate:[RoleGuard]},
  {path: 'product', title: 'Product', component: ProductComponent,  canActivate:[RoleGuard] },
  {path: 'user', title: 'User', component: UserComponent ,canActivate:[RoleGuard]},
  {path: 'user/:id', title: 'User', component: UserDetailsComponent ,canActivate:[RoleGuard]},
  {path: 'create-user', title: 'User', component: UserDetailsComponent ,canActivate:[RoleGuard]},
  {path: 'type', title: 'Type',  component: TypeComponent ,canActivate:[RoleGuard]},
  {path: 'brand', title: 'Brand', component: BrandComponent ,canActivate:[RoleGuard]},
  {path: 'delivery-method', title: 'Delivery Method', component: DeliveryMethodComponent ,canActivate:[RoleGuard]},
  {path: 'delivery-method/:id', title: 'Delivery Method', component: DeliveryMethodDetailsComponent ,canActivate:[RoleGuard]},
  {path: 'create-delivery-method', title: 'Delivery Method', component: DeliveryMethodDetailsComponent ,canActivate:[RoleGuard]},
  {path: 'all-order', title: 'All Order', component: AllOrderComponent ,canActivate:[RoleGuard]},
  {path: 'all-order/:id', title: 'All Order', component: AllOrderDetailComponent ,canActivate:[RoleGuard]},
  {path: 'unauthorized',title: 'Unauthorized', component: UnauthorizedComponent},
  {path: '**', redirectTo: '', pathMatch:'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
