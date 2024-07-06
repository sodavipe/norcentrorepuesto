import { Component, OnInit } from '@angular/core';
import { HomeService } from './_services/home.service';

declare var $:any;
declare function HOMEINITTEMPLATE ([]):any;
declare function ModalProductDetail():any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  sliders:any = [];
  categories:any = [];
  bestProducts:any = [];
  our_products:any = [];
  product_selected:any = null;
  FlashSale:any = null;
  FlashProductList:any = [];
  constructor(
    public homeService:HomeService
  ) { }

  ngOnInit(): void {
    let TIME_NOW =  new Date().getTime();
    this.homeService.listHome(TIME_NOW).subscribe((resp:any)=>{
      console.log(resp,"1");
      this.sliders = resp.sliders;
      this.categories = resp.categories;
      this.bestProducts = resp.best_products;
      this.our_products = resp.our_products;
      this.FlashSale = resp.FlashSale;
      this.FlashProductList = resp.campaign_products;
      setTimeout(()=>{
        HOMEINITTEMPLATE($);
      },50)
    });
  }
  OpenModal(bestProd:any){
    this.product_selected = null;

    setTimeout(() => {
      this.product_selected = bestProd;
      setTimeout(() => {
        ModalProductDetail();
      },50);
    }, 100);
  }
}
