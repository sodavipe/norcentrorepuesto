import { Component, OnInit } from '@angular/core';
import { DiscountService } from '../_services/discount.service';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DeleteNewDiscountComponent } from '../delete-new-discount/delete-new-discount.component';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-list-discount',
  templateUrl: './list-discount.component.html',
  styleUrls: ['./list-discount.component.scss']
})
export class ListDiscountComponent implements OnInit {

  isLoading$ : any = null;
  search:any = "";
  discounts:any = [];
  constructor(
    public _discountService:DiscountService,
    public router:Router,
    public ModalService: NgbModal,
    public datePipe:DatePipe
  ) {}

  ngOnInit(): void {
    this.isLoading$ = this._discountService.isLoading$;
    this.allDiscounts();
  }
  allDiscounts(){
    this._discountService.allDiscount(this.search).subscribe((resp:any)=>{
      console.log(resp);
      this.discounts = resp.discounts;
    })
  }
  refresh(){
    this.search = "";
    this.allDiscounts();
  }
  editDiscount(discount){
    this.router.navigateByUrl("/descuento/editar-descuento/"+discount._id);
  }
  getParseDate(date){
    return this.datePipe.transform(date,"yyyy-MM-dd");
  }
  delete(discount){
    const modalRef = this.ModalService.open(DeleteNewDiscountComponent,{centered:true, size: 'md'});
    modalRef.componentInstance.cupon_selected = discount;

    modalRef.componentInstance.CuponD.subscribe((resp:any)=>{
      let index = this.discounts.findIndex(item => item._id == discount._id);
      if(index != -1){
        this.discounts.splice(index,1);
        
      }
    })
  }
}
