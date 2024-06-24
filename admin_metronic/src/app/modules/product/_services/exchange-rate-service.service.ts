import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ExchangeRateServiceService {

  constructor(
    private http: HttpClient
  ) { }
  
  getExchangeRate(): Observable<any> {
    return this.http.get('https://api.exchangerate-api.com/v4/latest/PEN');
  }
}
