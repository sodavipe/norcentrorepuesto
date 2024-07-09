import { Component, OnInit } from '@angular/core';
import { EcommerceGuestService } from '../_service/ecommerce-guest.service';
import { ActivatedRoute, Router } from '@angular/router';

declare var $:any;
declare function LandingProductDetail():any;
@Component({
  selector: 'app-landing-product',
  templateUrl: './landing-product.component.html',
  styleUrls: ['./landing-product.component.css']
})
export class LandingProductComponent implements OnInit {

  slug:any = null;
  product_selected:any = null;

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
      setTimeout(() => {
        LandingProductDetail();
      }, 50);
    })
  }

}
