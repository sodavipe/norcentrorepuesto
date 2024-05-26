import { Component, OnInit } from '@angular/core';
import { CategoriesService } from '../_services/categories.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddNewCategoryComponent } from '../add-new-category/add-new-category.component';
import { URL_BACKEND } from 'src/app/config/config';


@Component({
  selector: 'app-list-category',
  templateUrl: './list-category.component.html',
  styleUrls: ['./list-category.component.scss']
})
export class ListCategoryComponent implements OnInit {
  category:any =[];
  search:any="";
  isLoading$:any=null;

  URL_BACKEND:any = URL_BACKEND;
  constructor(
    public _serviceCategory: CategoriesService,
    public ModalService: NgbModal,
  ) { }

  ngOnInit(): void {
    this.isLoading$ = this._serviceCategory.isLoading$;
    this.allCategories();
  }

  openCreate(){
    const modalRef = this.ModalService.open(AddNewCategoryComponent,{centered:true, size: 'md'});
    
    modalRef.componentInstance.CategoryC.subscribe((category:any)=>{
      this.category.unshift(category);
    })
  }

  refresh(){

  }

  allCategories(){
    this._serviceCategory.allCategories(this.search).subscribe((resp:any)=>{
      this.category = resp.category;
    })
  }

  editCategory(category){

  }

  delete(category){

  }
}
