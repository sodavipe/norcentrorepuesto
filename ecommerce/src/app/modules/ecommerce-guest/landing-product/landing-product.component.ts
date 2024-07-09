import { Component, OnInit } from '@angular/core';
import { EcommerceGuestService } from '../_service/ecommerce-guest.service';
import { ActivatedRoute, Router } from '@angular/router';

declare var $:any;
declare function LandingProductDetail():any;
declare function ModalProductDetail():any;
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

  constructor(
    public ecommerce_guest:EcommerceGuestService,
    public router:Router,
    public routerActive:ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.routerActive.params.subscribe((resp:any) =>{
      this.slug = resp["slug"];
    })
    console.log(this.slug);
    this.ecommerce_guest.showLandingProduct(this.slug).subscribe((resp:any)=>{
      console.log(resp);
      this.product_selected =  resp.product;
      this.related_products = resp.related_products
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
  getCallNewPrice(product:any){
    // if(this.FlashSale.type_discount == 1){
    //   return (product.price_soles - product.price_soles*this.FlashSale.discount*0.01).toFixed(2);
    // }else{
    //   return product.price_soles - this.FlashSale.discount;
    // }
    return 0;
  }
}
