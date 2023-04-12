import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home.component';
import { SharedModule } from '../shared/shared.module';
import { HomeItemComponent } from './home-item/home-item.component';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [
    HomeComponent,
    HomeItemComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    SharedModule,
  ],
  exports: [HomeComponent]
})
export class HomeModule { }
