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
  {path: '', component: HomeComponent},
  {path: 'test-error', component: TestErrorComponent},
  {path: 'server-error', component: ServerErrorComponent},
  {path: 'not-found', component: NotFoundComponent},
  {path: 'shop', loadChildren: () => import('./shop/shop.module').then(mod => mod.ShopModule)},
  {path: 'basket', loadChildren: () => import('./basket/basket.module').then(mod => mod.BasketModule)},
  {path: 'checkout', canActivate:[AuthGuard], loadChildren: () => import('./checkout/checkout.module').then(mod => mod.CheckoutModule)},
  {path: 'orders', canActivate:[AuthGuard], loadChildren: () => import('./orders/orders.module').then(mod => mod.OrdersModule)},
  {path: 'account', loadChildren: () => import('./account/account.module').then(mod => mod.AccountModule)},
  {path: 'product/:id', component: ProductDetailsComponent ,canActivate:[RoleGuard]},
  {path: 'create-product', component: ProductDetailsComponent ,canActivate:[RoleGuard]},
  {path: 'product', component: ProductComponent,  canActivate:[RoleGuard] },
  {path: 'user', component: UserComponent ,canActivate:[RoleGuard]},
  {path: 'user/:id', component: UserDetailsComponent ,canActivate:[RoleGuard]},
  {path: 'create-user', component: UserDetailsComponent ,canActivate:[RoleGuard]},
  {path: 'type', component: TypeComponent ,canActivate:[RoleGuard]},
  {path: 'brand', component: BrandComponent ,canActivate:[RoleGuard]},
  {path: 'delivery-method', component: DeliveryMethodComponent ,canActivate:[RoleGuard]},
  {path: 'delivery-method/:id', component: DeliveryMethodDetailsComponent ,canActivate:[RoleGuard]},
  {path: 'create-delivery-method', component: DeliveryMethodDetailsComponent ,canActivate:[RoleGuard]},
  {path: 'all-order', component: AllOrderComponent ,canActivate:[RoleGuard]},
  {path: 'all-order/:id', component: AllOrderDetailComponent ,canActivate:[RoleGuard]},
  {path: 'unauthorized', component: UnauthorizedComponent},
  {path: '**', redirectTo: '', pathMatch:'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
