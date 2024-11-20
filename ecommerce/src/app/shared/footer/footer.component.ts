import { Component, OnInit } from '@angular/core';
import { CartService } from 'src/app/modules/ecommerce-guest/_service/cart.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
  user:any = null;

  constructor(
  public cartService: CartService,
  ) { }

  ngOnInit(): void {
    this.user = this.cartService._authService.user;
  }

}
