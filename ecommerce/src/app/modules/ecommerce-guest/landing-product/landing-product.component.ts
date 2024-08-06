import { Component, OnInit } from '@angular/core';
import { EcommerceGuestService } from '../_service/ecommerce-guest.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CartService } from '../_service/cart.service';

declare var $:any;
declare function LandingProductDetail():any;
declare function ModalProductDetail():any;
declare function alertDanger([]):any;
declare function alertWarning([]):any;
declare function alertSuccess([]):any;
@Component({
  selector: 'app-landing-product',
  templateUrl: './landing-product.component.html',
  styleUrls: ['./landing-product.component.css']
})
export class LandingProductComponent implements OnInit {

  slug:any = null;
  product_selected:any = null;
  related_products:any = [];
  product_selected_modal:any = null;
  variedad_selected:any = null;


  discount_id:any;
  SALE_FLASH:any = null;
  constructor(
    public ecommerce_guest:EcommerceGuestService,
    public router:Router,
    public routerActive:ActivatedRoute,
    public cartService:CartService,
  ) { }

  ngOnInit(): void {
    this.routerActive.params.subscribe((resp:any) =>{
      this.slug = resp["slug"];
    })
    this.routerActive.queryParams.subscribe((resp:any) =>{
      this.discount_id = resp["_id"];
    })
    console.log(this.slug);
    this.ecommerce_guest.showLandingProduct(this.slug,this.discount_id).subscribe((resp:any)=>{
      console.log(resp);
      this.product_selected =  resp.product;
      this.related_products = resp.related_products;
      this.SALE_FLASH = resp.SALE_FLASH;
      setTimeout(() => {
        LandingProductDetail();
      }, 50);
    })
  }

  OpenModal(bestProd:any,FlashSale:any = null){
    this.product_selected_modal = null;

    setTimeout(() => {
      this.product_selected_modal = bestProd;
      this.product_selected_modal.FlashSale = FlashSale
      setTimeout(() => {
        ModalProductDetail();
      },50);
    }, 100);
  }

  getDiscount(){
    let discount = 0;
    if(this.SALE_FLASH){
      if(this.SALE_FLASH.type_discount == 1){
        return this.SALE_FLASH.discount * this.product_selected.price_soles*0.01
      }else{
        return this.SALE_FLASH.discount
      }
    }
    return discount;
  }
  getCallNewPrice(product:any){
    // if(this.FlashSale.type_discount == 1){
    //   return (product.price_soles - product.price_soles*this.FlashSale.discount*0.01).toFixed(2);
    // }else{
    //   return product.price_soles - this.FlashSale.discount;
    // }
    return 0;
  }
  selectedVariedad(variedad:any){
    this.variedad_selected = variedad;
  }
  AddCart(product:any){
    console.log(product);
    if(!this.cartService._authService.user){
      alertDanger("NECESITAS AUTENTICARTE PARA PODER AGREGAR EL PRODUCTO AL CARRITO")
      return;
    }if($("#qty-cart").val() == 0){
      alertDanger("NECESITAS AGREGAR UNA CANTIDAD MAYOR A 0 DEL PRODUCTO PARA EL CARRITO")
      return;
    }if(this.product_selected.type_inventario == 2){
      if(!this.variedad_selected){
        alertDanger("NECESITAS SELECCIONAR UNA VARIEDAD PARA EL PRODUCTO")
        return;
      }
      if(this.variedad_selected.stock < $("#qty-cart").val()){
        alertDanger("NECESITAS AGREGAR UNA CANTIDAD MENOR PORQUE NO HAY STOCK O NO HAY STOCK DISPONIBLE PARA LA VARIEDAD SELECCIONADA")
        return;
      }
    }
    let data = {
      user:this.cartService._authService.user._id,
      product:this.product_selected._id,
      type_discount: this.SALE_FLASH ? this.SALE_FLASH.type_discount : null,
      discount:this.SALE_FLASH ? this.SALE_FLASH.discount : 0,
      cantidad:$("#qty-cart").val(),
      variedad:this.variedad_selected? this.variedad_selected._id :null,
      code_cupon:null,
      code_discount:this.SALE_FLASH ? this.SALE_FLASH._id : null,
      price_unitario:this.product_selected.price_soles,
      subtotal:this.product_selected.price_soles - this.getDiscount(),
      total:(this.product_selected.price_soles - this.getDiscount())*$("#qty-cart").val(),
    }
    this.cartService.registerCart(data).subscribe((resp:any)=>{
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
