import { Component, OnInit } from '@angular/core';
import { EcommerceGuestService } from '../_service/ecommerce-guest.service';

declare function priceRangeSlider():any;
declare var $:any;
@Component({
  selector: 'app-filters-product',
  templateUrl: './filters-product.component.html',
  styleUrls: ['./filters-product.component.css']
})
export class FiltersProductComponent implements OnInit {
  categories:any = [];
  variedades:any = [];

  category_selected:any = [];
  variedad_selected:any = {
    _id:null,
  };
  is_discount:any = 1; //1 es normal y 2 es productos con descuento
  constructor(
    public ecommerce_guest:EcommerceGuestService
  ) { }

  ngOnInit(): void {
    this.ecommerce_guest.configInitial().subscribe((resp:any)=>{
      console.log(resp);
      this.categories = resp.categories;
      this.variedades = resp.variedades;
    })
    setTimeout(() => {
      priceRangeSlider();
    }, 50);
    this.filterProduct();
  }
  addCategory(category:any){
    let index = this.category_selected.findIndex((item:any) => item == category._id);
    if(index != -1){
      this.category_selected.splice(index,1);
    }else{
      this.category_selected.push(category._id);
    }
  }
  selectedDiscount(value:number){
    this.is_discount = value;
  }
  selectedVariedad(variedad:any){
    this.variedad_selected = variedad;
  }
  filterProduct(){
    let data = {
      category_selected:this.category_selected,
      is_discount:this.is_discount,
      variedad_selected:this.variedad_selected,
      price_min:$("amount-min").val(),
      price_max:$("amount-max").val(),
    }
    this.ecommerce_guest.filterProduct(data).subscribe((resp:any)=>{
      console.log(resp);
    })
  }
}
