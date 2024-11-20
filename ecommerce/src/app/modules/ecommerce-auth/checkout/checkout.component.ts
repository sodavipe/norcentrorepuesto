import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { EcommerceAuthService } from '../_service/ecommerce-auth.service';
import { CartService } from '../../ecommerce-guest/_service/cart.service';
import { EcommerceAuthExchangeRateService } from '../_service/ecommerce-auth-exchange-rate.service';

declare function alertDanger([]):any;
declare function alertWarning([]):any;
declare function alertSuccess([]):any;
declare var paypal:any;

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  @ViewChild('paypal',{static: true}) paypalElement?: ElementRef;

  listAddressClient:any = [];
  name:any = null;
  surname:any = null;
  pais:any = 'Perú';
  address:any = null;
  referencia:any = null;
  region:any = null;
  ciudad:any = null;
  telefono:any = null;
  email:any = null;
  nota:any = null;
  address_client_selected:any = null;
  impuestoshow:any = null;

  preciodolar:any = 0;
  listCart:any = [];
  subtotalCart:any = 0;
  totalCart:any = 0;
  totalCartUSD:any = 0;
  exchangeRate: number = 0;
  constructor(
    public authEcommerce:EcommerceAuthService,
    public cartService:CartService,
    public exchangeRateService:EcommerceAuthExchangeRateService
  ) { }
  loadExchangeRate(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.exchangeRateService.getExchangeRate().subscribe((data: any) => {
        this.exchangeRate = data.rates.USD;
        this.exchangeRateService.getExchangeRateUSD().subscribe((data:any)=>{
          this.preciodolar = data.rates.PEN;
        })
        console.log(this.exchangeRate);
        resolve();
      }, (error) => {
        reject(error);
      });
    });
  }
  async ngOnInit(): Promise<void> {
    await this.loadExchangeRate();
    this.authEcommerce.listAddressClient(this.authEcommerce.authService.user._id).subscribe((resp:any)=>{
      console.log(resp);
      this.listAddressClient = resp.address_client;
    })
    this.cartService.currentDataCart$.subscribe((resp:any)=>{
      console.log(resp);
      this.listCart = resp;
      const subtotal = this.listCart.reduce((sum: any, item: any) => sum + item.total, 0);
      const impuesto = subtotal * 0.18
      this.impuestoshow=impuesto
      this.subtotalCart = this.listCart.reduce((sum: any, item: any) => sum + item.total, 0).toFixed(2);
      this.totalCart = (subtotal + impuesto).toFixed(2);
      this.totalCartUSD = (this.totalCart*this.exchangeRate).toFixed(2);
    })
    paypal.Buttons({
      // optional styling for buttons
      // https://developer.paypal.com/docs/checkout/standard/customize/buttons-style-guide/
      style: {
        color: "gold",
        shape: "rect",
        layout: "vertical"
      },

      // set up the transaction
      createOrder: (data:any, actions:any) => {
          // pass in any options from the v2 orders create call:
          // https://developer.paypal.com/api/orders/v2/#orders-create-request-body
          if(this.listCart.length == 0){
            alertDanger("NO SE PUEDE PROCESAR UNA ORDEN SIN NINGÚN ELEMENTO DENTRO DEL CARRITO");
            return;
          }
          if(!this.address_client_selected){
            alertDanger("NECESITAS SELECCIONAR UNA DIRECCIÓN DE ENVIO");
            return;
          }
          const createOrderPayload = {
            purchase_units: [
              {
                amount: {
                    description: "COMPRAR POR EL ECOMMERCE",
                    value: this.totalCartUSD,
                }
              }
            ]
          };
          return actions.order.create(createOrderPayload);
      },
      // finalize the transaction
      onApprove: async (data:any, actions:any) => {

          let Order = await actions.order.capture();

        // Order.purchase_units[0].payments.captures[0].id

        let sale = {
          user: this.authEcommerce.authService.user._id,
          currency_payment: 'PEN',
          method_payment: 'PAYPAL',
          n_transaccion: Order.purchase_units[0].payments.captures[0].id,
          total: this.totalCart,
        };

        let sale_address = {
          name:this.name,
          surname:this.surname,
          pais:this.pais,
          address:this.address,
          referencia:this.referencia,
          ciudad:this.ciudad,
          region:this.region,
          telefono:this.telefono,
          email:this.email,
          nota:this.nota,
        }


        this.authEcommerce.registerSale({sale:sale,sale_address:sale_address}).subscribe((resp:any)=>{
          console.log(resp);
          alertSuccess(resp.message);
          location.reload();
        })
          // return actions.order.capture().then(captureOrderHandler);
      },
      // handle unrecoverable errors
      onError: (err:any) => {
          console.error('An error prevented the buyer from checking out with PayPal');
      }
    }).render(this.paypalElement?.nativeElement);

  }
  store(){
    if(this.address_client_selected){
      this.updateAddress();
    }else{
      this.registerAddress();
    }
  }
  registerAddress(){
    if(
      !this.name ||
      !this.surname ||
      !this.pais ||
      !this.address ||
      !this.region ||
      !this.ciudad ||
      !this.telefono ||
      !this.email){
      alertDanger("NECESITAS INGRESAR LOS CAMPOS OBLIGATORIOS DE LA DIRECCIÓN")
      return;
    }
    let data={
      user:this.authEcommerce.authService.user._id,
      name: this.name,
      surname: this.surname,
      pais: this.pais,
      address: this.address,
      referencia: this.referencia,
      region: this.region,
      ciudad: this.ciudad,
      telefono: this.telefono,
      email: this.email,
      nota: this.nota,
    };
    this.authEcommerce.registerAddressClient(data).subscribe((resp:any)=>{
      console.log(resp);
      this.listAddressClient.push(resp.address_client);
      alertSuccess(resp.message);
      this.resetFormulario();
    })
  }
  updateAddress(){
    if(
      !this.name ||
      !this.surname ||
      !this.pais ||
      !this.address ||
      !this.region ||
      !this.ciudad ||
      !this.telefono ||
      !this.email){
      alertDanger("NECESITAS INGRESAR LOS CAMPOS OBLIGATORIOS DE LA DIRECCIÓN")
      return;
    }
    let data={
      _id:this.address_client_selected._id,
      user:this.authEcommerce.authService.user._id,
      name: this.name,
      surname: this.surname,
      pais: this.pais,
      address: this.address,
      referencia: this.referencia,
      region: this.region,
      ciudad: this.ciudad,
      telefono: this.telefono,
      email: this.email,
      nota: this.nota,
    };
    this.authEcommerce.updateAddressClient(data).subscribe((resp:any)=>{
      console.log(resp);
      let INDEX = this.listAddressClient.findIndex((item:any) => item._id == this.address_client_selected._id)
      this.listAddressClient[INDEX] = resp.address_client;
      alertSuccess(resp.message);
    })
  }
  resetFormulario(){
  this.name = null;
  this.surname = null;
  this.address = null;
  this.referencia = null;
  this.region = null;
  this.ciudad = null;
  this.telefono = null;
  this.email = null;
  this.nota = null;
  }
  newAddress(){
    alertSuccess("Usted ha vuelto al formulario de Registrar Direcciones")
    this.resetFormulario();
    this.address_client_selected = null;
  }
  addressClientSelected(list_address:any){
    this.address_client_selected = list_address;
    this.name = this.address_client_selected.name;
    this.surname = this.address_client_selected.surname;
    this.address = this.address_client_selected.address;
    this.referencia = this.address_client_selected.referencia;
    this.region = this.address_client_selected.region;
    this.ciudad = this.address_client_selected.ciudad;
    this.telefono = this.address_client_selected.telefono;
    this.email = this.address_client_selected.email;
    this.nota = this.address_client_selected.nota;
  }

}
