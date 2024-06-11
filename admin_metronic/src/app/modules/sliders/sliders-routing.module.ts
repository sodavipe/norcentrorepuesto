import { Component, NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListNewSliderComponent } from './list-new-slider/list-new-slider.component';
import { SlidersComponent } from './sliders.component';

const routes: Routes = [
  {
  path:'',
  component: SlidersComponent,
  children:[
  {
    path:'lista-sliders',
    component:ListNewSliderComponent
  }
  ] 
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SlidersRoutingModule { }
