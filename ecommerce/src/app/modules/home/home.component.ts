import { Component, OnInit, } from '@angular/core';
import { HomeService } from './_services/home.service';
import { CartService } from '../ecommerce-guest/_service/cart.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

declare var $:any;
declare function HOMEINITTEMPLATE ([]):any;
declare function ModalProductDetail():any;
declare function alertDanger([]):any;
declare function alertWarning([]):any;
declare function alertSuccess([]):any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  email: string = '';
  sliders:any = [];
  categories:any = [];
  bestProducts:any = [];
  our_products:any = [];
  product_selected:any = null;
  FlashSale:any = null;
  FlashProductList:any = [];
  variedad_selected:any = null;
  SALE_FLASH:any = null;
  constructor(
    public homeService:HomeService,
    public cartService:CartService,
    public router:Router,
    public http: HttpClient
    // public changeDetectorRef:ChangeDetectorRef
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

      setTimeout(() => {
        if (this.FlashSale) {
          var eventCounter = $(".sale-countdown");
          let PARSE_DATE = new Date(this.FlashSale.end_date);

          let DATE = PARSE_DATE.getFullYear() + "/" + (PARSE_DATE.getMonth() + 1) + "/" + (PARSE_DATE.getDate() + 1);
          console.log(DATE);
          if (eventCounter.length) {
            eventCounter.countdown(DATE, function (e: any) {
              eventCounter.html(
                e.strftime(
                  "<div class='countdown-section'><div><div class='countdown-number'>%-D</div> <div class='countdown-unit'>Day</div> </div></div><div class='countdown-section'><div><div class='countdown-number'>%H</div> <div class='countdown-unit'>Hrs</div> </div></div><div class='countdown-section'><div><div class='countdown-number'>%M</div> <div class='countdown-unit'>Min</div> </div></div><div class='countdown-section'><div><div class='countdown-number'>%S</div> <div class='countdown-unit'>Sec</div> </div></div>"
                )
              );
            });
          }
        }

        HOMEINITTEMPLATE($);

      }, 50);
    });
  }
  OpenModal(bestProd:any,FlashSale:any = null){
    this.product_selected = null;

    setTimeout(() => {
      this.product_selected = bestProd;
      this.product_selected.FlashSale = FlashSale
      setTimeout(() => {
        ModalProductDetail();
      },50);
    }, 100);
  }
  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  getCallNewPrice(product:any){
    if(this.FlashSale.type_discount == 1){
      return (product.price_soles - product.price_soles*this.FlashSale.discount*0.01).toFixed(2);
    }else{
      return product.price_soles - this.FlashSale.discount;
    }
  }
  gestDiscountProduct(bestProd:any,is_sale_flash=null){
    if(is_sale_flash){
      if(this.FlashSale.type_discount == 1){
          return bestProd.price_soles*this.FlashSale.discount*0.01;
        }else{
          return this.FlashSale.discount;
        }
    }else{
      if(bestProd.campaign_discount){
        if(bestProd.campaign_discount.type_discount == 1){ // 1 es Procentaje, 2 es Moneda
          return bestProd.price_soles*bestProd.campaign_discount.discount*0.01;
        }else{
          return bestProd.campaign_discount.discount;
        }
      }
    }
    return 0
  }
  getRouterDiscount(bestProd:any){
    if(bestProd.campaign_discount){
      return {_id:bestProd.campaign_discount._id};
    }
    return {};
  }

  AddCart(product:any,is_sale_flash:any =null){
    console.log(product);

    if(!this.cartService._authService.user){
      alertDanger("NECESITAS AUTENTICARTE PARA PODER AGREGAR EL PRODUCTO AL CARRITO")
      return;
    }if($("#qty-cart").val() == 0){
      alertDanger("NECESITAS AGREGAR UNA CANTIDAD MAYOR A 0 DEL PRODUCTO PARA EL CARRITO")
      return;
    }if(product.type_inventario == 2){
      let LINK_DISCOUNT="";
      if(is_sale_flash){
        LINK_DISCOUNT = "?_id="+this.FlashSale._id;
      }else{
        if(product.campaign_discount){
          LINK_DISCOUNT = "?_id="+product.campaign_discount._id;
        }
      }
      this.router.navigateByUrl("/landing-product/"+product.slug+LINK_DISCOUNT);
    }
    let type_discount = null;
    let discount = 0;
    let code_discount = null;
    if(is_sale_flash){
      type_discount = this.FlashSale.type_discount,
      discount = this.FlashSale.discount,
      code_discount = this.FlashSale._id
    }else{
      if(product.campaign_discount){
        type_discount = product.campaign_discount.type_discount,
        discount = product.campaign_discount.discount,
        code_discount = product.campaign_discount._id
      }
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
      subtotal:product.price_soles - this.gestDiscountProduct(product,is_sale_flash),
      total:(product.price_soles - this.gestDiscountProduct(product,is_sale_flash))*1,
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
  selectedVariedad(variedad:any){
    this.variedad_selected = variedad;
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
  AddCartModal(product:any,is_sale_flash:any =null){
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
    let type_discount = null;
    let discount = 0;
    let code_discount = null;
    if(is_sale_flash){
      type_discount = this.FlashSale.type_discount,
      discount = this.FlashSale.discount,
      code_discount = this.FlashSale._id
    }else{
      if(product.campaign_discount){
        type_discount = product.campaign_discount.type_discount,
        discount = product.campaign_discount.discount,
        code_discount = product.campaign_discount._id
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
      subtotal:product.price_soles - this.gestDiscountProduct(product,is_sale_flash),
      total:(product.price_soles - this.gestDiscountProduct(product,is_sale_flash))*1,
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
  subscribe() {
    if (this.email) {
        const body = { email: this.email };
        this.http.post('http://localhost:3000/api/subscription/subscribe', body).subscribe(
            (response: any) => { // Asegúrate de tratar la respuesta como `any`
                // Manejo de la respuesta
                if (response && response.message) {
                    alertSuccess(response.message); // Muestra el mensaje de éxito
                } else {
                    alertDanger('Respuesta inesperada del servidor.'); // Si no hay mensaje esperado
                }
                this.email = ''; // Limpia el campo de entrada
            },
            (error) => {
                // Manejo de errores
                console.error(error); // Muestra el error en la consola
                // Si hay un mensaje de error del servidor, úsalo
                let errorMessage = 'Hubo un error al suscribirte. Por favor, inténtalo de nuevo.';
                if (error.error && error.error.message) {
                    errorMessage = error.error.message; // Mensaje de error del servidor
                }
                alertDanger(errorMessage); // Muestra la alerta de error
            }
        );
    } else {
        alertDanger('Por favor, introduce un correo electrónico válido.');
    }
}

}
