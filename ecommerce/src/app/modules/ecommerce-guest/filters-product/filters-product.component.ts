import { Component, OnInit } from '@angular/core';
import { EcommerceGuestService } from '../_service/ecommerce-guest.service';
import { CartService } from '../_service/cart.service';
import { Router } from '@angular/router';

declare function priceRangeSlider():any;
declare function ModalProductDetail():any;
declare var $:any;
declare function alertDanger([]):any;
declare function alertWarning([]):any;
declare function alertSuccess([]):any;
@Component({
  selector: 'app-filters-product',
  templateUrl: './filters-product.component.html',
  styleUrls: ['./filters-product.component.css']
})
export class FiltersProductComponent implements OnInit {
  categories:any = [];
  variedades:any = [];

  product_selected:any = null;
  category_selected:any = [];
  variedad_selected:any = {
    _id:null,
  };
  products:any = [];
  is_discount:any = 1; //1 es normal y 2 es productos con descuento
  constructor(
    public ecommerce_guest:EcommerceGuestService,
    public cartService:CartService,
    public router:Router,
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
  OpenModal(product:any){
    this.product_selected = null;

    setTimeout(() => {
      this.product_selected = product;
      setTimeout(() => {
        ModalProductDetail();
      },50);
    }, 120);
  }
  getCallNewPrice(product:any){
    if(product.campaign_discount){
      if(product.campaign_discount.type_discount == 1){
        return (product.price_soles - product.price_soles*product.campaign_discount.discount*0.01).toFixed(2);
      }else{
        return product.price_soles - product.campaign_discount.discount;
      }
    }
    return 0
  }
  filterProduct(){
    let data = {
      category_selected:this.category_selected,
      is_discount:this.is_discount,
      variedad_selected:this.variedad_selected._id ? this.variedad_selected : null,
      price_min:$("#amount-min").val(),
      price_max:$("#amount-max").val(),
    }
    this.ecommerce_guest.filterProduct(data).subscribe((resp:any)=>{
      console.log(resp);
      this.products = resp.products
    })
  }
  addCategory(category:any){
    let index = this.category_selected.findIndex((item:any) => item == category._id);
    if(index != -1){
      this.category_selected.splice(index,1);
    }else{
      this.category_selected.push(category._id);
    }
    this.filterProduct();
  }
  selectedDiscount(value:number){
    this.is_discount = value;
    this.filterProduct();
  }
  selectedVariedad(variedad:any){
    this.variedad_selected = variedad;
    this.filterProduct();
  }


  getRouterDiscount(product:any){
    if(product.campaign_discount){
      return {_id:product.campaign_discount._id};
    }
    return {};
  }
  gestDiscountProduct(product:any){
      if(product.campaign_discount){
        if(product.campaign_discount.type_discount == 1){ // 1 es Procentaje, 2 es Moneda
          return product.price_soles*product.campaign_discount.discount*0.01;
        }else{
          return product.campaign_discount.discount;
        }
      }
    return 0
  }
  AddCart(product:any){
    if(!this.cartService._authService.user){
      alertDanger("NECESITAS AUTENTICARTE PARA PODER AGREGAR EL PRODUCTO AL CARRITO")
      return;
    }if($("#qty-cart").val() == 0){
      alertDanger("NECESITAS AGREGAR UNA CANTIDAD MAYOR A 0 DEL PRODUCTO PARA EL CARRITO")
      return;
    }if(product.type_inventario == 2){
      this.router.navigateByUrl("/landing-product/"+product.slug);
    }
    let type_discount = null;
    let discount = 0;
    let code_discount = null;
      if(product.campaign_discount){
        type_discount = product.campaign_discount.type_discount,
        discount = product.campaign_discount.discount,
        code_discount = product.campaign_discount._id
      }
    let data = {
      user:this.cartService._authService.user._id,
      product:product._id,
      type_discount: type_discount,
      discount:discount,
      cantidad:1,
      variedad:null,
      code_cupon:null,
      code_discount:code_discount,
      price_unitario:product.price_soles,
      subtotal:product.price_soles - this.gestDiscountProduct(product),
      total:(product.price_soles - this.gestDiscountProduct(product))*1,
    }
    this.cartService.registerCart(data).subscribe((resp:any)=>{
      if (product.variedades && product.variedades.length > 0 && !product.variedadSeleccionada) {
        alertSuccess("SELECCIONE UNA VARIEDAD");
        return;
      }
      if(resp.message == 403){
        alertDanger(resp.message_text);
        return
      }else{
        this.cartService.changeCart(resp.cart);
        alertSuccess("EL PRODUCTO SE HA AGREGADO EXITÓSAMENTE AL CARRITO");
      }
    },error=>{
      console.log(error);
      if(error.error.message == "EL TOKEN NO ES VÁLIDO"){
        this.cartService._authService.logout();
      }
    });
  }
}
