import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SlidersRoutingModule } from './sliders-routing.module';
import { SlidersComponent } from './sliders.component';
import { AddNewSliderComponent } from './add-new-slider/add-new-slider.component';
import { EditNewSliderComponent } from './edit-new-slider/edit-new-slider.component';
import { DeleteNewSliderComponent } from './delete-new-slider/delete-new-slider.component';
import { ListNewSliderComponent } from './list-new-slider/list-new-slider.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgbModule, NgbModalModule, NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { InlineSVGModule } from 'ng-inline-svg';
import { CRUDTableModule } from 'src/app/_metronic/shared/crud-table';
import { UsersRoutingModule } from '../users/users-routing.module';


@NgModule({
  declarations: [SlidersComponent, AddNewSliderComponent, EditNewSliderComponent, DeleteNewSliderComponent, ListNewSliderComponent],
  imports: [
    CommonModule,
    SlidersRoutingModule,
    //
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
export class SlidersModule { }
