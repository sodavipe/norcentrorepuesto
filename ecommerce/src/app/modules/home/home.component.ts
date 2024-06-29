import { Component, OnInit } from '@angular/core';
import { HomeService } from './_services/home.service';

declare var $:any;
declare function HOMEINITTEMPLATE ([]):any;


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

  constructor(
    public homeService:HomeService
  ) { }

  ngOnInit(): void {

    this.homeService.listHome().subscribe((resp:any)=>{
      console.log(resp,"1");
      this.sliders = resp.sliders;
      this.categories = resp.categories;
      this.bestProducts = resp.best_products;
      this.our_products = resp.our_products
      setTimeout(()=>{
        console.log("2");
        HOMEINITTEMPLATE($);
      },50)
    });
  }

  showImagen(our_product:any){
    let IMAGEN = "";
    IMAGEN = our_product.galerias[2].imagen;
    return IMAGEN
  }

}
