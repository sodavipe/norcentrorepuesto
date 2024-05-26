import { Component, OnInit } from '@angular/core';
import { CategoriesService } from '../_services/categories.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddNewCategoryComponent } from '../add-new-category/add-new-category.component';

@Component({
  selector: 'app-list-category',
  templateUrl: './list-category.component.html',
  styleUrls: ['./list-category.component.scss']
})
export class ListCategoryComponent implements OnInit {
  category:any =[];
  search:any=null;
  isLoading$:any=null;
  constructor(
    public _serviceCategory: CategoriesService,
    public ModalService: NgbModal,
  ) { }

  ngOnInit(): void {
  }

  openCreate(){
    const modalRef = this.ModalService.open(AddNewCategoryComponent,{centered:true, size: 'md'});
    
  }

  refresh(){

  }

  allCategories(){

  }

  editCategory(category){

  }

  delete(category){

  }
}
