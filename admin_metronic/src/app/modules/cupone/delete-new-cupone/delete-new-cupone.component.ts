import { Component, Input, OnInit, Output,EventEmitter } from '@angular/core';
import { NoticyAlertComponent } from 'src/app/componets/notifications/noticy-alert/noticy-alert.component';
import { CuponeService } from '../_services/cupone.service';
import { Toaster } from 'ngx-toast-notifications';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-delete-new-cupone',
  templateUrl: './delete-new-cupone.component.html',
  styleUrls: ['./delete-new-cupone.component.scss']
})
export class DeleteNewCuponeComponent implements OnInit {

  @Input() cupon_selected:any;
  @Output() CuponD:EventEmitter<any> = new EventEmitter();
  
  constructor(
    public modal: NgbActiveModal,
    public cuponService: CuponeService,
    public toaster: Toaster
  ) { }

  ngOnInit(): void {

  }

  delete(){
    this.cuponService.deleteCupone(this.cupon_selected._id).subscribe((resp:any)=>{
      console.log(resp);
      this.CuponD.emit("");
      this.toaster.open(NoticyAlertComponent,{text:`success- '¡El cupón se ha eliminado correctamente!.'`});
      this.modal.close();
      return;
    }, (error)=>{
      if(error.error){
        this.toaster.open(NoticyAlertComponent,{text:`danger- '${error.error.message}'`});
      }
    })
  }

}
