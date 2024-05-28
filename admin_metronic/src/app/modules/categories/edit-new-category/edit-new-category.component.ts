import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Toaster } from 'ngx-toast-notifications';
import { NoticyAlertComponent } from 'src/app/componets/notifications/noticy-alert/noticy-alert.component';
import { CategoriesService } from '../_services/categories.service';
import { URL_BACKEND } from 'src/app/config/config';

@Component({
  selector: 'app-edit-new-category',
  templateUrl: './edit-new-category.component.html',
  styleUrls: ['./edit-new-category.component.scss']
})
export class EditNewCategoryComponent implements OnInit {
  @Input() category_selected:any;
  
  @Output() CategoryE:EventEmitter<any> = new EventEmitter();
  
  isLoading$:any;
  name:any = null;

  imagen_file:any = null;
  imagen_previsualizacion:any = null;
  state:any = null;
  constructor(
    public _categoryService: CategoriesService,
    public modal:NgbActiveModal,
    public toaster: Toaster,
  ) { }
  
  ngOnInit(): void {
    this.name = this.category_selected.title;
    this.imagen_previsualizacion = URL_BACKEND +'api/categories/uploads/category/'+ this.category_selected.imagen;
    this.state=this.category_selected.state
  }
  processFile($event){
    console.log($event.target)
    if($event.target.files[0].type.indexOf("image") < 0){
      this.imagen_previsualizacion = null;
      this.toaster.open(NoticyAlertComponent,{text:`danger- 'Upps! Necesita ingresar un archivo de tipo imagen.'`});
      return;
    }
    this.imagen_file = $event.target.files[0];
    let reader = new FileReader();
    reader.readAsDataURL(this.imagen_file);
    reader.onloadend = () => this.imagen_previsualizacion = reader.result;
  }
  save(){
    console.log(this.imagen_file);
    console.log(this.name);
    if(!this.name){
      this.toaster.open(NoticyAlertComponent,{text:`danger- 'Upps! Necesita ingresar todos los campos.'`});
      return;
    }
    let formData = new FormData();
    formData.append('_id',this.category_selected._id);
    formData.append('title',this.name);
    formData.append('state',this.state);
    if(this.imagen_file){
      formData.append('portada',this.imagen_file);
    }
    //

    this._categoryService.updateCategory(formData).subscribe((resp:any)=>{
      console.log(resp);
      this.CategoryE.emit(resp.category);
      this.modal.close();
    })
  }

}
