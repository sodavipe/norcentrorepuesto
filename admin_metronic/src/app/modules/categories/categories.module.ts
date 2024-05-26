import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CategoriesRoutingModule } from './categories-routing.module';
import { CategoriesComponent } from './categories.component';
import { AddNewCategoryComponent } from './add-new-category/add-new-category.component';
import { EditNewCategoryComponent } from './edit-new-category/edit-new-category.component';
import { DeleteNewCategoryComponent } from './delete-new-category/delete-new-category.component';
import { ListCategoryComponent } from './list-category/list-category.component';


@NgModule({
  declarations: [CategoriesComponent, AddNewCategoryComponent, EditNewCategoryComponent, DeleteNewCategoryComponent, ListCategoryComponent],
  imports: [
    CommonModule,
    CategoriesRoutingModule
  ]
})
export class CategoriesModule { }
