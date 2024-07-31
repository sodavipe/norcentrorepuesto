import { Injectable } from '@angular/core';
import { AuthService } from '../../auth-profile/_services/auth.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { URL_SERVICIOS } from 'src/app/config/config';

@Injectable({
  providedIn: 'root'
})
export class EcommerceAuthService {

  constructor(
    public authService:AuthService,
    public http: HttpClient
  ) { }

  //DIRECCIÓN DE CLIENTE

  listAddressClient(user_id:any){
    let headers = new HttpHeaders({'token':this.authService.token});
    let URL = URL_SERVICIOS+"address_client/list?user_id="+user_id;
    return this.http.get(URL,{headers:headers});
  }

  registerAddressClient(data:any){
    let headers = new HttpHeaders({'token':this.authService.token});
    let URL = URL_SERVICIOS+"address_client/register";
    return this.http.post(URL,data,{headers:headers});
  }
  updateAddressClient(data:any){
    let headers = new HttpHeaders({'token':this.authService.token});
    let URL = URL_SERVICIOS+"address_client/update";
    return this.http.put(URL,data,{headers:headers});
  }
  deleteAddressClient(address_client_id:any){
    let headers = new HttpHeaders({'token':this.authService.token});
    let URL = URL_SERVICIOS+"address_client/delete/"+address_client_id;
    return this.http.delete(URL,{headers:headers});
  }

  // FIN

  registerSale(data:any){
    let headers = new HttpHeaders({'token':this.authService.token});
    let URL = URL_SERVICIOS+"sale/register";
    return this.http.post(URL,data,{headers:headers});
  }

  showProfileClient(data:any){
    let headers = new HttpHeaders({'token':this.authService.token});
    let URL = URL_SERVICIOS+"home/profile_client";
    return this.http.post(URL,data,{headers:headers});
  }
  UpdateProfileClient(data:any){
    let headers = new HttpHeaders({'token':this.authService.token});
    let URL = URL_SERVICIOS+"home/update_client";
    return this.http.post(URL,data,{headers:headers});
  }
}
