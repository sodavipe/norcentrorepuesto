import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from '../../auth-profile/_services/auth.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { URL_SERVICIOS } from 'src/app/config/config';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  public cart = new BehaviorSubject<Array<any>>([]);
  public currentDataCart$ = this.cart.asObservable();
  constructor(
    public _authService:AuthService,
    public http: HttpClient,
  ) { }

  changeCart(DATACART:any){
    let listCart = this.cart.getValue();
    let INDEX = listCart.findIndex((item:any) => item._id == DATACART._id);
    if(INDEX != -1){
      listCart[INDEX] = DATACART;
    }else{
      listCart.unshift(DATACART);
    }
    this.cart.next(listCart);
  }
  resetCart(){
    let listCart:any = [];
    this.cart.next(listCart);
  }

  removeItemCart(DATACART:any){
    let listCart = this.cart.getValue();
    let INDEX = listCart.findIndex((item:any) => item._id == DATACART._id);
    if(INDEX != -1){
      listCart.splice(INDEX,1);
    }
    this.cart.next(listCart);
  }
  registerCart(data:any){
    let headers = new HttpHeaders({'token':this._authService.token});
    let URL = URL_SERVICIOS+"cart/register";
    return this.http.post(URL,data,{headers:headers});
  }
  listCart(user_id:any){
    let headers = new HttpHeaders({'token':this._authService.token});
    let URL = URL_SERVICIOS+"cart/list?user_id="+user_id;
    return this.http.get(URL,{headers:headers});
  }
  updateCart(data:any){
    let headers = new HttpHeaders({'token':this._authService.token});
    let URL = URL_SERVICIOS+"cart/update";
    return this.http.put(URL,data,{headers:headers});
  }
}
