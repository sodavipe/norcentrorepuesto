import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CategoriesRoutingModule } from './categories-routing.module';
import { CategoriesComponent } from './categories.component';
import { AddNewCategoryComponent } from './add-new-category/add-new-category.component';
import { EditNewCategoryComponent } from './edit-new-category/edit-new-category.component';
import { DeleteNewCategoryComponent } from './delete-new-category/delete-new-category.component';
import { ListCategoryComponent } from './list-category/list-category.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgbModule, NgbModalModule, NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { InlineSVGModule } from 'ng-inline-svg';
import { CRUDTableModule } from 'src/app/_metronic/shared/crud-table';
import { UsersRoutingModule } from '../users/users-routing.module';


@NgModule({
  declarations: [CategoriesComponent, AddNewCategoryComponent, EditNewCategoryComponent, DeleteNewCategoryComponent, ListCategoryComponent],
  imports: [
    CommonModule,
    CategoriesRoutingModule,
    FormsModule,
    UsersRoutingModule,
    HttpClientModule,
    NgbModule,
    ReactiveFormsModule,
    InlineSVGModule,
    CRUDTableModule,
    NgbModalModule,
    NgbDatepickerModule,
  ]
})
export class CategoriesModule { }
    