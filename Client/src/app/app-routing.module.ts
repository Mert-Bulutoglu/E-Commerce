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
  {path: 'product/:id', component: ProductDetailsComponent /*canActivate:[AuthGuard] */ },
  {path: 'create-product', component: ProductDetailsComponent /*canActivate:[AuthGuard] */ },
  {path: 'product', component: ProductComponent /*canActivate:[AuthGuard] */ },
  {path: 'user', component: UserComponent /*canActivate:[AuthGuard] */},
  {path: 'user/:id', component: UserDetailsComponent /*canActivate:[AuthGuard] */},
  {path: 'create-user', component: UserDetailsComponent /*canActivate:[AuthGuard] */},
  {path: '**', redirectTo: '', pathMatch:'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
