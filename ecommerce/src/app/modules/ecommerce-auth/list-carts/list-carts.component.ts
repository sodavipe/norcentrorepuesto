import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from '../../ecommerce-guest/_service/cart.service';
import Swal from 'sweetalert2';
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
  code_cupon:any = null;
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
  aplicarCupon(){
    let data = {
      code:this.code_cupon,
      user_id: this.cartService._authService.user._id,
    }
    this.cartService.aplicarCupon(data).subscribe((resp:any) =>{
      console.log(resp);
      if(resp.message == 403){
        alertDanger(resp.message_text);
      }else{
        alertSuccess(resp.message_text);
        this.listCarts();
      }
    })
  }
  listCarts(){
    this.cartService.resetCart();
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
  deleteAllItems(cart_id: any) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "No podrás deshacer esta acción",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar todo',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.cartService.deleteAllCartItems(cart_id).subscribe(
          (resp: any) => {
            console.log(resp);
            this.cartService.resetCart();
            Swal.fire(
              'Eliminado',
              'Todos los elementos del carrito han sido eliminados.',
              'success'
            );
          },
          (error: any) => {
            console.log(error);
            Swal.fire(
              'Error',
              'Ocurrió un error al intentar eliminar todos los elementos del carrito.',
              'error'
            );
          }
        );
      }
    });
  }
}
