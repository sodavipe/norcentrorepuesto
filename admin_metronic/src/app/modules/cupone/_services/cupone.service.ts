import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { AuthService } from '../../auth';
import { URL_SERVICIOS } from 'src/app/config/config';
import { finalize } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CuponeService {

  isLoading$: Observable<boolean>;
  isLoadingSubject: BehaviorSubject<boolean>;
  
  constructor(
    private http: HttpClient,
    public authservice: AuthService,
  ) {
    this.isLoadingSubject = new BehaviorSubject<boolean>(false);
    this.isLoading$ = this.isLoadingSubject.asObservable();
  }

  allCupons(search=''){
    this.isLoadingSubject.next(true);
    let headers = new HttpHeaders({'token': this.authservice.token});
    let URL = URL_SERVICIOS + "/cupones/list?search="+search;
    return this.http.get(URL,{headers:headers}).pipe(
      finalize(()=> this.isLoadingSubject.next(false))
    );
  }

  showCupon(cupon_id=''){
    this.isLoadingSubject.next(true);
    let headers = new HttpHeaders({'token': this.authservice.token});
    let URL = URL_SERVICIOS + "/cupones/show?cupon_id="+cupon_id;
    return this.http.get(URL,{headers:headers}).pipe(
      finalize(()=> this.isLoadingSubject.next(false))
    );
  }

  CuponsConfig(){
    this.isLoadingSubject.next(true);
    let headers = new HttpHeaders({'token': this.authservice.token});
    let URL = URL_SERVICIOS + "/cupones/config";
    return this.http.get(URL,{headers:headers}).pipe(
      finalize(()=> this.isLoadingSubject.next(false))
    );
  }
  
  createCupone(data){
    this.isLoadingSubject.next(true);
    let headers = new HttpHeaders({'token': this.authservice.token});
    let URL = URL_SERVICIOS + "/cupones/register";
    return this.http.post(URL,data,{headers:headers}).pipe(
      finalize(()=> this.isLoadingSubject.next(false))
    );
  }
  updateCupone(data){
    this.isLoadingSubject.next(true);
    let headers = new HttpHeaders({'token': this.authservice.token});
    let URL = URL_SERVICIOS + "/cupones/update";
    return this.http.put(URL,data,{headers:headers}).pipe(
      finalize(()=> this.isLoadingSubject.next(false))
    );
  }
  deleteCupone(cupon_id){
    this.isLoadingSubject.next(true);
    let headers = new HttpHeaders({'token': this.authservice.token});
    let URL = URL_SERVICIOS + "/cupones/delete?_id="+cupon_id;
    return this.http.delete(URL,{headers:headers}).pipe(
      finalize(()=> this.isLoadingSubject.next(false))
    );
  }

}
