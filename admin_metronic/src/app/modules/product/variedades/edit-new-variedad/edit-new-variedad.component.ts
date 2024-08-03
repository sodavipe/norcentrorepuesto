import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ProductService } from '../../_services/product.service';
import { Toaster } from 'ngx-toast-notifications';
import { NoticyAlertComponent } from 'src/app/componets/notifications/noticy-alert/noticy-alert.component';

@Component({
  selector: 'app-edit-new-variedad',
  templateUrl: './edit-new-variedad.component.html',
  styleUrls: ['./edit-new-variedad.component.scss']
})
export class EditNewVariedadComponent implements OnInit {

  @Input() variedad:any;
  @Output() VariedadE:EventEmitter<any> = new EventEmitter();

  isLoading$:any;
  variedad_multiple:any = null;
  stock:any = 0;
  constructor(
    public modal:NgbActiveModal,
    public _serviceProduct:ProductService,
    public toaster: Toaster,
  ) { }

  ngOnInit(): void {
    this.variedad_multiple = this.variedad.valor;
    this.stock = this.variedad.stock;
  }
  update(){
    if (this.variedad_multiple == ''){
      this.toaster.open(NoticyAlertComponent,{text:`danger- 'DEBE DE INGRESAR UNA VARIEDAD'`})
      return;
    }
    let data = {
      _id: this.variedad._id,
      valor: this.variedad_multiple,
      stock: this.stock
    }
    this._serviceProduct.updateVariedad(data).subscribe((resp:any) =>{
      console.log(resp);
      this.VariedadE.emit(resp.variedad);
      this.modal.close();
    })
  }
}
