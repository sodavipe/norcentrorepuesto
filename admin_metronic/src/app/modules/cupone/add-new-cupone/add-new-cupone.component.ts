import { Component, OnInit } from '@angular/core';
import { CuponeService } from '../_services/cupone.service';
import { Toaster } from 'ngx-toast-notifications';
import { NoticyAlertComponent } from 'src/app/componets/notifications/noticy-alert/noticy-alert.component';

@Component({
  selector: 'app-add-new-cupone',
  templateUrl: './add-new-cupone.component.html',
  styleUrls: ['./add-new-cupone.component.scss']
})
export class AddNewCuponeComponent implements OnInit {
  
  isLoading$:any;
  code:any = null;

  products:any = [];
  categories:any = []; 
  
  product:any = "";
  category:any = "";

  type_discount:any = 1;
  discount:any = 0;
  type_count:any = 1; 
  num_use:any = 0;
  type_segment:any = 1; 
  products_selected:any = [];
  categories_selected:any = []; 

  constructor(
    public _cuponService:CuponeService,
    public toaster:Toaster
  ) {}

  ngOnInit(): void {
    this.isLoading$ = this._cuponService.isLoading$;
    this._cuponService.CuponsConfig().subscribe((resp:any)=>{
      console.log(resp)
      this.categories = resp.categories;
      this.products = resp.products;
    })
    this.product = "";
    this.category = "";
  }
  checkedTypeDiscount(value){
    this.type_discount = value;
    this.discount = 0;
  }
  checkedTypeCount(value){
    this.type_count = value;
  }
  checkedTypeSegment(value){
    this.type_segment = value;
    this.categories_selected = [];
    this.products_selected = [];
  }
  AddProductOrCategory() {
    if (this.type_segment == 1) {
        if (this.product == "") {
            this.toaster.open(NoticyAlertComponent, { text: `danger- 'Upps! SEÑALE ALGÚN PRODUCTO.'` });
            return;
        }

        let INDEX = this.products_selected.findIndex(item => item._id == this.product);
        if (INDEX != -1) {
            this.toaster.open(NoticyAlertComponent, { text: `danger- 'Upps! EL PRODUCTO YA EXISTE, SELECCIONE OTRO.'` });
            return;
        } else {
            let PRODUCT_S = this.products.find(item => item._id == this.product);
            this.product = "";
            this.products_selected.unshift(PRODUCT_S);
        }
    } else {
        if (this.category == "") {
            this.toaster.open(NoticyAlertComponent, { text: `danger- 'Upps! SEÑALE ALGUNA CATEGORIA.'` });
            return;
        }

        let INDEX = this.categories_selected.findIndex(item => item._id == this.category);
        if (INDEX != -1) {
            this.toaster.open(NoticyAlertComponent, { text: `danger- 'Upps! LA CATEGORIA YA EXISTE, SELECCIONE OTRA.'` });
            return;
        } else {
            let CATEGORIA_S = this.categories.find(item => item._id == this.category);
            this.category = "";
            this.categories_selected.unshift(CATEGORIA_S);
        }
    }
  }
  validateDiscount(){
    if (this.type_discount === 1 && (this.discount < 0 || this.discount > 100)) {
      this.toaster.open(NoticyAlertComponent, { text: `danger- 'Upps! EL DESCUENTO DEBE ESTAR ENTRE 0 Y 100.'` });
      this.discount = 0;
    }
  }
  removeProduct(product){
      let INDEX = this.products_selected.findIndex(item => item._id == product._id)
      if(INDEX != -1){
        this.products_selected.splice(INDEX,1);
      }
    }
  removeCategory(category){
    let INDEX = this.categories_selected.findIndex(item => item._id == category._id)
    if(INDEX != -1){
      this.categories_selected.splice(INDEX,1);
    }
  }

  save(){

    if (!this.code || !this.discount){
      this.toaster.open(NoticyAlertComponent, { text: `danger- 'Upps! ALGUNOS CAMPOS ESTÁN VACIOS'` });
      return;
    }
    if(this.type_count == 2){
      if(this.num_use == 0){
      this.toaster.open(NoticyAlertComponent, { text: `danger- 'Upps! TIENES QUE DIGITAR EL NÚMERO DE USOS'` });
      return;
      }
    }
    if(this.type_segment == 1){
      if(this.products_selected.length == 0){
        this.toaster.open(NoticyAlertComponent, { text: `danger- 'Upps! TIENES QUE DIGITAR UN PRODUCTO AL MENOS'` });
        return;
      }
    }
    if(this.type_segment == 2){
      if(this.categories_selected.length == 0){
        this.toaster.open(NoticyAlertComponent, { text: `danger- 'Upps! TIENES QUE DIGITAR UNA CATEGORIA AL MENOS'` });
        return;
      }
    }

    let PRODUCTS = [];
    let CATEGORIES = [];

    this.products_selected.forEach(element => {
      PRODUCTS.push({_id:element._id});
    });

    this.categories_selected.forEach(element => {
      CATEGORIES.push({_id:element._id});
    });

    let data ={
      code : this.code,
      type_discount : this.type_discount,
      discount : this.discount,
      type_count : this.type_count,
      num_use : this.num_use,
      type_segment : this.type_segment,
      products: PRODUCTS,
      categories : CATEGORIES,
    };

    this._cuponService.createCupone(data).subscribe((resp:any) =>{
      console.log(resp);
      if(resp.message == 403){
        this.toaster.open(NoticyAlertComponent, { text: `danger- '${resp.message_text}'` });
        return;
      }else{
        this.toaster.open(NoticyAlertComponent, { text: `primary- '${resp.message_text}'` });
        this.products_selected = [];
        this.categories_selected = [];
        this.code = null;
        this.type_discount= 1;
        this.discount= 0;
        this.type_count= 1;
        this.num_use= null;
        this.type_segment= 1;
        return;
      }
    })
  }

}