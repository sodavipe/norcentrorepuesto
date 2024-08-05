import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from 'src/app/modules/ecommerce-guest/_service/cart.service';
declare function alertSuccess([]):any;


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  listCart:any = [];

  totalCart:any = 0;
  user:any = null;
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
}
