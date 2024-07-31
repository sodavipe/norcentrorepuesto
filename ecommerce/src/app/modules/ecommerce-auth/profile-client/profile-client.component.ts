import { Component, OnInit } from '@angular/core';
import { EcommerceAuthService } from '../_service/ecommerce-auth.service';

@Component({
  selector: 'app-profile-client',
  templateUrl: './profile-client.component.html',
  styleUrls: ['./profile-client.component.css']
})

export class ProfileClientComponent implements OnInit {
  sale_orders:any = [];
  is_detail_sale:any = false;

  order_selected:any = null;
  scrollToTop(event: Event): void {
    event.preventDefault(); // Previene el comportamiento predeterminado del enlace
    window.scrollTo({
        top: 0,
        behavior: 'smooth' // Para un desplazamiento suave
    });
  }
  constructor(
    public authEcommerceService:EcommerceAuthService
  ) { }

  ngOnInit(): void {
    this.showProfileClient();
  }
  showProfileClient(){
    let data = {
      user_id: this.authEcommerceService.authService.user._id
    }
    this.authEcommerceService.showProfileClient(data).subscribe((resp:any)=>{
      console.log(resp);
      this.sale_orders = resp.sale_orders;
    })
  }
  getDate(date:any){
    let newDate = new Date(date);

    return `${newDate.getDate()}/${newDate.getMonth()+1}/${newDate.getFullYear()}`;
  }
  viewDetailSale(order:any){
    this.is_detail_sale = true;
    this.order_selected = order;
  }
  goHome(){
    this.is_detail_sale = false;
    this.order_selected = null;
  }

}
