import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { URL_SERVICIOS } from 'src/app/config/config';

@Injectable({
  providedIn: 'root'
})
export class EcommerceGuestService {

  constructor(
    public http:HttpClient,
  ) { }

  showLandingProduct(slug:string,discount_id:any=null){
    let LINK = "";
    if(discount_id){
      LINK = "?_id="+discount_id;
    }
    let URL = URL_SERVICIOS+"home/landing-product/"+slug+LINK;
    return this.http.get(URL);
  }
}
