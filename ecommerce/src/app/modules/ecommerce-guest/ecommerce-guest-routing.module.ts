import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EcommerceGuestComponent } from './ecommerce-guest.component';
import { LandingProductComponent } from './landing-product/landing-product.component';
import { FiltersProductComponent } from './filters-product/filters-product.component';

const routes: Routes = [
  {
    path:'',
    component:EcommerceGuestComponent,
    children:[
      {
        path:'landing-product/:slug',
        component:LandingProductComponent
      },
      {
        path:'filtro-de-productos',
        component:FiltersProductComponent
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EcommerceGuestRoutingModule { }
