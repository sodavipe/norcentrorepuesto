import { Component, OnInit } from '@angular/core';
import { CategoriesService } from '../_services/categories.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddNewCategoryComponent } from '../add-new-category/add-new-category.component';
import { URL_BACKEND } from 'src/app/config/config';
import { EditNewCategoryComponent } from '../edit-new-category/edit-new-category.component';
import { DeleteNewCategoryComponent } from '../delete-new-category/delete-new-category.component';


@Component({
  selector: 'app-list-category',
  templateUrl: './list-category.component.html',
  styleUrls: ['./list-category.component.scss']
})
export class ListCategoryComponent implements OnInit {
  categories:any =[];
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
      this.categories.unshift(category);
    })
  }

  refresh(){
    this.search = "";
    this.allCategories();
  }

  allCategories(){
    this._serviceCategory.allCategories(this.search).subscribe((resp:any)=>{
      this.categories = resp.category;
    })
  }

  editCategory(category){
    const modalRef = this.ModalService.open(EditNewCategoryComponent,{centered:true, size: 'md'});
    modalRef.componentInstance.category_selected = category;

    modalRef.componentInstance.CategoryE.subscribe((category:any)=>{
      let index = this.categories.findIndex(item => item._id == category._id);
      if(index != -1){
        this.categories[index] = category;
        
      }
    })
  }

  delete(category){
    const modalRef = this.ModalService.open(DeleteNewCategoryComponent,{centered:true, size: 'md'});
    modalRef.componentInstance.category_selected = category;

    modalRef.componentInstance.CategoryD.subscribe((resp:any)=>{
      let index = this.categories.findIndex(item => item._id == category._id);
      if(index != -1){
        this.categories.splice(index,1);
        
      }
    })
  }
}
