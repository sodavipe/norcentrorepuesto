import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Toaster } from 'ngx-toast-notifications';
import { NoticyAlertComponent } from 'src/app/componets/notifications/noticy-alert/noticy-alert.component';
import { CategoriesService } from '../_services/categories.service';


@Component({
  selector: 'app-delete-new-category',
  templateUrl: './delete-new-category.component.html',
  styleUrls: ['./delete-new-category.component.scss']
})
export class DeleteNewCategoryComponent implements OnInit {
  @Input() category_selected:any;
  @Output() CategoryD:EventEmitter<any> = new EventEmitter();
  
  constructor(
    public modal: NgbActiveModal,
    public categoryService: CategoriesService,
    public toaster: Toaster
  ) { }

  ngOnInit(): void {

  }

  delete(){
    this.categoryService.deleteCategory(this.category_selected._id).subscribe((resp:any)=>{
      console.log(resp);
      this.CategoryD.emit("");
      this.toaster.open(NoticyAlertComponent,{text:`success- '¡La categoria se ha eliminado correctamente!.'`});
      this.modal.close();
      return;
    }, (error)=>{
      if(error.error){
        this.toaster.open(NoticyAlertComponent,{text:`danger- '${error.error.message}'`});
      }
    })
  }
}

