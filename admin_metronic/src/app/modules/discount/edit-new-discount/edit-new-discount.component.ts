import { Component, OnInit } from '@angular/core';
import { Toaster } from 'ngx-toast-notifications';
import { NoticyAlertComponent } from 'src/app/componets/notifications/noticy-alert/noticy-alert.component';
import { DiscountService } from '../_services/discount.service';
import { ActivatedRoute } from '@angular/router';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-edit-new-discount',
  templateUrl: './edit-new-discount.component.html',
  styleUrls: ['./edit-new-discount.component.scss']
})
export class EditNewDiscountComponent implements OnInit {

  
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
  start_date:any = null;
  end_date:any = null;
  discount_id:any= null;
  discount_selected:any = null;

  //

  type_campaign:any = 1;
  today: string = null;

  constructor(
    public _discountService:DiscountService,
    public toaster:Toaster,
    public activedrouter: ActivatedRoute,
    public datePipe:DatePipe
  ) {}

  ngOnInit(): void {
    this.isLoading$ = this._discountService.isLoading$;
    this.activedrouter.params.subscribe((resp:any) =>{
      this.discount_id = resp["id"]
    })
    this._discountService.DiscountConfig().subscribe((resp:any)=>{
      console.log(resp)
      this.categories = resp.categories;
      this.products = resp.products;
      this.showDiscount();
    })
    this.product = "";
    this.category = "";
    const currentDate = new Date();
    const day = ('0' + currentDate.getDate()).slice(-2);
    const month = ('0' + (currentDate.getMonth() + 1)).slice(-2);
    const year = currentDate.getFullYear();
    this.today = `${year}-${month}-${day}`;
  }
  showDiscount(){
    this._discountService.showDiscount(this.discount_id).subscribe((resp:any)=>{
      console.log(resp);
      this.discount_selected = resp.discount;
      this.type_discount = this.discount_selected.type_discount ;
      this.discount = this.discount_selected.discount ;
      //products_selected
      //categories_selected
      this.start_date = this.formatDate(this.discount_selected.start_date)  ;
      this.end_date = this.formatDate(this.discount_selected.end_date) ;

      this.type_segment = this.discount_selected.type_segment;
      this.type_campaign = this.discount_selected.type_campaign ? this.discount_selected.type_campaign : 1;
      if(this.type_segment == 1){
        this.discount_selected.products.forEach(products_selected => {
          this.products.forEach(product => {
            if(product._id == products_selected._id){
              this.products_selected.push(product);
            }
          });
        });
      }else{
        this.discount_selected.categories.forEach(products_selected => {
          this.categories.forEach(category => {
            if(category._id == products_selected._id){
              this.categories_selected.push(this.category);
            }
          });
        });
      }
    })
  }
  formatDate(date){
    return this.datePipe.transform(date,"yyyy-MM-dd","UTC");
  }
  checkedTypeCampaign(value){
    this.type_campaign = value;
    this.checkedTypeSegment(1);
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
    
    const currentDate = new Date();
    const day = ('0' + currentDate.getDate()).slice(-2);
    const month = ('0' + (currentDate.getMonth() + 1)).slice(-2);
    const year = currentDate.getFullYear();
    const today = `${year}-${month}-${day}`;

    if (!this.discount || !this.start_date || !this.end_date){
      this.toaster.open(NoticyAlertComponent, { text: `danger- 'Upps! ALGUNOS CAMPOS ESTÁN VACIOS'` });
      return;
    }
        // Verifica que las fechas no sean anteriores a hoy
        if (this.start_date < today || this.end_date < today) {
          this.toaster.open(NoticyAlertComponent, { text: `danger- 'Upps! LAS FECHAS NO PUEDEN SER ANTERIORES A HOY'` });
          return;
        }
    
        // Verifica que la fecha de inicio no sea posterior a la fecha de fin
        if (this.start_date > this.end_date) {
          this.toaster.open(NoticyAlertComponent, { text: `danger- 'Upps! LA FECHA DE INICIO NO PUEDE SER POSTERIOR A LA FECHA DE FIN'` });
          return;
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
    let product_s = [];
    let category_s = []
    this.products_selected.forEach(element => {
      PRODUCTS.push({_id:element._id});
      product_s.push(element._id);
    });

    this.categories_selected.forEach(element => {
      CATEGORIES.push({_id:element._id});
      category_s.push(element._id);
    });

    let data ={
      _id: this.discount_id,
      type_campaign: this.type_campaign,
      type_discount : this.type_discount,
      discount : this.discount,
      type_segment : this.type_segment,
      start_date: this.start_date,
      end_date: this.end_date,
      start_date_num: new Date(this.start_date).getTime(),
      end_date_num: new Date(this.end_date).getTime(),
      products: PRODUCTS,
      categories : CATEGORIES,
      product_s: product_s,
      category_s: category_s,
    };

    this._discountService.updateDiscount(data).subscribe((resp:any) =>{
      console.log(resp);
      if(resp.message == 403){
        this.toaster.open(NoticyAlertComponent, { text: `danger- '${resp.message_text}'` });
        return;
      }else{
        this.toaster.open(NoticyAlertComponent, { text: `primary- '${resp.message_text}'` });
        //this.products_selected = [];
        //this.categories_selected = [];
        //this.code = null;
        //this.type_discount= 1;
        //this.discount= 0;
        //this.type_count= 1;
        //this.num_use= null;
        //this.type_segment= 1;
        //this.start_date=null;
        //this.end_date=null;
        return;
      }
    })
  }
}
