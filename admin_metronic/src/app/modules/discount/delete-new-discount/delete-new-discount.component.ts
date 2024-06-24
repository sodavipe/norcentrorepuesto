import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DiscountService } from '../_services/discount.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Toaster } from 'ngx-toast-notifications';
import { NoticyAlertComponent } from 'src/app/componets/notifications/noticy-alert/noticy-alert.component';

@Component({
  selector: 'app-delete-new-discount',
  templateUrl: './delete-new-discount.component.html',
  styleUrls: ['./delete-new-discount.component.scss']
})
export class DeleteNewDiscountComponent implements OnInit {

  @Input() discount_selected:any;
  @Output() DiscountD:EventEmitter<any> = new EventEmitter();
  
  constructor(
    public modal: NgbActiveModal,
    public discountService: DiscountService,
    public toaster: Toaster
  ) { }

  ngOnInit(): void {

  }

  delete(){
    this.discountService.deleteDiscount(this.discount_selected._id).subscribe((resp:any)=>{
      console.log(resp);
      this.DiscountD.emit("");
      this.toaster.open(NoticyAlertComponent,{text:`success- '¡El descuento se ha eliminado correctamente!.'`});
      this.modal.close();
      return;
    }, (error)=>{
      if(error.error){
        this.toaster.open(NoticyAlertComponent,{text:`danger- '${error.error.message}'`});
      }
    })
  }

}
