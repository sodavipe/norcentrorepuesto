import { Component, OnInit } from '@angular/core';
import { URL_BACKEND } from 'src/app/config/config';
import {ProductService} from '../_services/product.service';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Toaster } from 'ngx-toast-notifications';
import { DeleteNewProductComponent } from '../delete-new-product/delete-new-product.component';
import { NoticyAlertComponent } from 'src/app/componets/notifications/noticy-alert/noticy-alert.component';
import { CategoriesService } from '../../categories/_services/categories.service';
@Component({
  selector: 'app-list-products',
  templateUrl: './list-products.component.html',
  styleUrls: ['./list-products.component.scss']
})
export class ListProductsComponent implements OnInit {
  products:any = [];
  category:any = '';
  isLoading$:any;
  search:any = null;
  categories:any = [];
  constructor(
    public _productService:ProductService,
    public router:Router,
    public toaster:Toaster,
    public ModalService:NgbModal,
    public _serviceCategory: CategoriesService
  ) { }
  
  ngOnInit(): void {
    this.isLoading$ = this._productService.isLoading$;
    this.allProducts();
    this._serviceCategory.allCategories().subscribe((resp:any)=>{
      console.log(resp);
      this.categories = resp.category;
      this.loadServices();
    })
  } 
  loadServices(){
    this._productService.isLoadingSubject.next(true);
    setTimeout(() => {
      this._productService.isLoadingSubject.next(false);
    }, 50);
  }
  allProducts(){
    
    this._productService.allProducts(this.search,this.category).subscribe((resp:any)=>{
      console.log(resp);
      this.products = resp.products;
    })
  }
  refresh(){
    this.category=null;
    this.search=null;
    this.allProducts();
  }
  editProduct(product){
    this.router.navigateByUrl("/productos/editar-producto/"+product._id);
  }
  delete(product){
    const modalRef = this.ModalService.open(DeleteNewProductComponent,{centered:true, size: 'sm'});
    modalRef.componentInstance.product = product;

    modalRef.componentInstance.ProductD.subscribe((resp:any)=>{
      let index = this.products.findIndex(item => item._id == product._id);
      if(index != -1){
        this.products.splice(index,1);
        this.toaster.open(NoticyAlertComponent,{text:`primary- 'EL PRODUCTO SE ELIMINÓ CORRECTAMENTE'`})
      }
    })
  }

}
