import { Component, OnInit } from '@angular/core';
import { EcommerceAuthService } from '../_service/ecommerce-auth.service';


declare function alertDanger([]):any;
declare function alertWarning([]):any;
declare function alertSuccess([]):any;

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

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
  constructor(
    public authEcommerce:EcommerceAuthService,
  ) { }

  ngOnInit(): void {
    this.authEcommerce.listAddressClient(this.authEcommerce.authService.user._id).subscribe((resp:any)=>{
      console.log(resp);
      this.listAddressClient = resp.address_client;
    })
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
