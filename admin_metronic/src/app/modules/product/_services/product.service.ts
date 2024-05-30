import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { AuthService } from '../../auth';
import { finalize } from 'rxjs/operators';
import { URL_SERVICIOS } from 'src/app/config/config';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  isLoading$: Observable<boolean>;
  isLoadingSubject: BehaviorSubject<boolean>;
  
  constructor(
    private http: HttpClient,
    public authservice: AuthService,
  ) {
    this.isLoadingSubject = new BehaviorSubject<boolean>(false);
    this.isLoading$ = this.isLoadingSubject.asObservable();
  }


  allProducts(search=''){
    this.isLoadingSubject.next(true);
    let headers = new HttpHeaders({'token': this.authservice.token});
    let URL = URL_SERVICIOS + "/products/list?search="+search;
    return this.http.get(URL,{headers:headers}).pipe(
      finalize(()=> this.isLoadingSubject.next(false))
    );
  }
  
  showProduct(product_id=''){
    this.isLoadingSubject.next(true);
    let headers = new HttpHeaders({'token': this.authservice.token});
    let URL = URL_SERVICIOS + "/products/show/"+product_id;
    return this.http.get(URL,{headers:headers}).pipe(
      finalize(()=> this.isLoadingSubject.next(false))
    );
  }

  createProducts(data){
    this.isLoadingSubject.next(true);
    let headers = new HttpHeaders({'token': this.authservice.token});
    let URL = URL_SERVICIOS + "/products/register";
    return this.http.post(URL,data,{headers:headers}).pipe(
      finalize(()=> this.isLoadingSubject.next(false))
    );
  }
  updateProducts(data){
    this.isLoadingSubject.next(true);
    let headers = new HttpHeaders({'token': this.authservice.token});
    let URL = URL_SERVICIOS + "/products/update";
    return this.http.put(URL,data,{headers:headers}).pipe(
      finalize(()=> this.isLoadingSubject.next(false))
    );
  }
  deleteProducts(category_id){
    this.isLoadingSubject.next(true);
    let headers = new HttpHeaders({'token': this.authservice.token});
    let URL = URL_SERVICIOS + "/products/delete?_id="+category_id;
    return this.http.delete(URL,{headers:headers}).pipe(
      finalize(()=> this.isLoadingSubject.next(false))
    );
  }
}
