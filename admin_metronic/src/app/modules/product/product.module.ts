import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductRoutingModule } from './product-routing.module';
import { ProductComponent } from './product.component';
import { AddNewProductComponent } from './add-new-product/add-new-product.component';
import { EditNewProductComponent } from './edit-new-product/edit-new-product.component';
import { DeleteNewProductComponent } from './delete-new-product/delete-new-product.component';
import { ListProductsComponent } from './list-products/list-products.component';


@NgModule({
  declarations: [ProductComponent, AddNewProductComponent, EditNewProductComponent, DeleteNewProductComponent, ListProductsComponent],
  imports: [
    CommonModule,
    ProductRoutingModule
  ]
})
export class ProductModule { }
