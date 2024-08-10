import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EcommerceGuestRoutingModule } from './ecommerce-guest-routing.module';
import { EcommerceGuestComponent } from './ecommerce-guest.component';
import { LandingProductComponent } from './landing-product/landing-product.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { FiltersProductComponent } from './filters-product/filters-product.component';


@NgModule({
  declarations: [
    EcommerceGuestComponent,
    LandingProductComponent,
    FiltersProductComponent
  ],
  imports: [
    CommonModule,
    EcommerceGuestRoutingModule,
    SharedModule,
    //
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule
  ]
})
export class EcommerceGuestModule { }
