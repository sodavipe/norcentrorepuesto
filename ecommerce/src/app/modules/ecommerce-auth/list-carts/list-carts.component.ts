import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from '../../ecommerce-guest/_service/cart.service';

declare function sectionCart():any;
declare function alertDanger([]):any;
declare function alertWarning([]):any;
declare function alertSuccess([]):any;
@Component({
  selector: 'app-list-carts',
  templateUrl: './list-carts.component.html',
  styleUrls: ['./list-carts.component.css']
})
export class ListCartsComponent implements OnInit {

  listCart:any = [];
  subtotalCart:any = 0;
  totalCart:any = 0;
  constructor(
    public router:Router,
    public cartService: CartService,
  ) { }

  ngOnInit(): void {
    setTimeout(() => {
      sectionCart();
    }, 25);
    this.cartService.currentDataCart$.subscribe((resp:any)=>{
      console.log(resp);
      this.listCart = resp;
      const subtotal = this.listCart.reduce((sum: any, item: any) => sum + item.total, 0);
      const impuesto = subtotal * 0.18
      this.subtotalCart = this.listCart.reduce((sum: any, item: any) => sum + item.total, 0).toFixed(2);
      this.totalCart = (subtotal + impuesto).toFixed(2)
    });
  }
  updateTotals() {
    const subtotal = this.listCart.reduce((sum: any, item: any) => sum + item.total, 0);
    const impuesto = subtotal * 0.18;
    this.subtotalCart = subtotal.toFixed(2);
    this.totalCart = (subtotal + impuesto).toFixed(2);
  }
  dec(cart:any){
    if(cart.cantidad - 1 == 0){
      alertDanger("NO PUEDES DISMINUIR UN PRODUCTO A 0");
      return
    }
    cart.cantidad = cart.cantidad - 1;
    cart.subtotal = cart.price_unitario * cart.cantidad;
    cart.total = cart.price_unitario * cart.cantidad;

    //AQUI VA LA FUNCION PARA ENVIARLO AL BACKEND
    console.log(cart,"DEC")
    let data = {
      _id:cart._id,
      cantidad:cart.cantidad,
      subtotal:cart.subtotal,
      total:cart.total,
      variedad:cart.variedad ? cart.variedad._id : null,
      product:cart.product._id,
    }
    this.cartService.updateCart(data).subscribe((resp:any)=>{
      console.log(resp);
      this.updateTotals();
    })

  }
  inc(cart:any){
    console.log(cart,"INC")

    cart.cantidad = cart.cantidad + 1;
    cart.subtotal = cart.price_unitario * cart.cantidad;
    cart.total = cart.price_unitario * cart.cantidad;


    let data = {
      _id:cart._id,
      cantidad:cart.cantidad,
      subtotal:cart.subtotal,
      total:cart.total,
      variedad:cart.variedad ? cart.variedad._id : null,
      product:cart.product._id,
    }
    this.cartService.updateCart(data).subscribe((resp:any)=>{
      console.log(resp);
      this.updateTotals();
    })
    //AQUI VA LA FUNCION PARA ENVIARLO AL BACKEND
  }
  removeCart(cart:any){
    this.cartService.deleteCart(cart._id).subscribe((resp:any)=>{
      console.log(resp);
      this.cartService.removeItemCart(cart);
    })
  }
}
