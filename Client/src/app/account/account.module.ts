import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { AccountRoutingModule } from './account-routing.module';
import { SharedModule } from '../shared/shared.module';
import { SocialLoginModule } from '@abacritt/angularx-social-login';
import { PasswordResetComponent } from './password-reset/password-reset.component';
import { UpdatePasswordComponent } from './update-password/update-password.component';



@NgModule({
  declarations: [
    RegisterComponent,
    LoginComponent,
    PasswordResetComponent,
    UpdatePasswordComponent,
  ],
  imports: [
    CommonModule,
    AccountRoutingModule,
    SharedModule,
    SocialLoginModule 
  ]
})
export class AccountModule { }
