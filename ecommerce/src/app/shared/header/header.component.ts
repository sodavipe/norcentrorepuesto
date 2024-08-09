import { Component, ElementRef, OnInit, ViewChild,AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { fromEvent, debounceTime } from 'rxjs';
import { CartService } from 'src/app/modules/ecommerce-guest/_service/cart.service';
declare function alertSuccess([]):any;


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, AfterViewInit {

  listCart:any = [];

  totalCart:any = 0;
  user:any = null;

  search_product:any = null;
  product_search:any = [];

  source:any;
@ViewChild("filter") filter?:ElementRef;
  constructor(
    public router:Router,
    public cartService: CartService,
  ) { }

  ngOnInit(): void {
    this.user = this.cartService._authService.user;
    this.cartService.currentDataCart$.subscribe((resp:any)=>{
      console.log(resp);
      this.listCart = resp;
      this.totalCart = this.listCart.reduce((sum: any, item: any) => sum + item.total, 0).toFixed(2);
    });
    if(this.cartService._authService.user){
      this.cartService.listCart(this.cartService._authService.user._id).subscribe((resp:any)=>{
        console.log(resp);
        // this.listCart = resp.carts;
        resp.carts.forEach((cart:any) => {
          this.cartService.changeCart(cart);
        });
      })
    }
  }
  ngAfterViewInit(): void {
    this.source = fromEvent(this.filter?.nativeElement, "keyup");
    this.source.pipe(debounceTime(500)).subscribe((c:any) => {
      let data = {
        search_product: this.search_product,
      }
      if(this.search_product.length > 1){
        this.cartService.searchProduct(data).subscribe((resp:any) => {
          console.log(resp);
          this.product_search = resp.products;
        })
      }
    })
  }
  removeCart(cart:any){
    this.cartService.deleteCart(cart._id).subscribe((resp:any)=>{
      console.log(resp);
      this.cartService.removeItemCart(cart);
      alertSuccess("PRODUCTO ELIMINADO");
    })
  }
  isHome(){
    return this.router.url == "" || this.router.url == "/" ? true : false;
  }
  logout(){
    this.cartService._authService.logout();
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



  searchProduct(){

  }
}
