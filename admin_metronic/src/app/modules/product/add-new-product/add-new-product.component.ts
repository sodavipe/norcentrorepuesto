import { Component, OnInit } from '@angular/core';
import { Toaster } from 'ngx-toast-notifications';
import { NoticyAlertComponent } from 'src/app/componets/notifications/noticy-alert/noticy-alert.component';
import { ProductService } from '../_services/product.service';
import { CategoriesService } from '../../categories/_services/categories.service';

@Component({
  selector: 'app-add-new-product',
  templateUrl: './add-new-product.component.html',
  styleUrls: ['./add-new-product.component.scss']
})
export class AddNewProductComponent implements OnInit {

  title:any = null;
  sku:any = null;
  category:any = []; //Esto actua como categories
  categories:any = ""; //Esto actua como categorie
  price_soles:any = 0;
  price_usd: any = 0;
  imagen_file:any = null;
  imagen_previsualizacion:any = null;
  resumen:any = null;
  description:any = null;
  //
  tag:any = null;
  tags:any = [];

  isLoading$:any;
  constructor(
    public _productService:ProductService,
    public _CategoryService:CategoriesService,
    public toaster:Toaster,
  ) { }

  ngOnInit(): void {
    this.isLoading$ = this._productService.isLoading$;
    this._CategoryService.allCategories().subscribe((resp:any)=>{
      console.log(resp);
      this.category = resp.category;
      this.loadServices();
    })
  }

  loadServices(){
    this._productService.isLoadingSubject.next(true);
    setTimeout(() => {
      this._productService.isLoadingSubject.next(false);
    }, 50);
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
    this.loadServices();
  }
  addTag(){
   // this.tags.push(this.tag);
   // this.tag = "";
   if (this.tag && this.tag.trim()) {
    this.tags.push(this.tag.trim());
    this.tag = "";
  } else {
    this.toaster.open(NoticyAlertComponent, { text: `danger- 'La etiqueta no puede estar vacía.'` });
  }
  }
  removeTag(i){
    this.tags.splice(i,1);
  }
  save(){
    if(!this.title || !this.categories || !this.price_soles || !this.price_usd ||
      !this.resumen || !this.description || !this.sku ||  this.tags.length == 0 || !this.imagen_file){
      
      this.toaster.open(NoticyAlertComponent,{text:`danger- 'Upps! NECESITAS DIGITAR TODOS LOS CAMPOS DEL FORMULARIO.'`});
      return;
    }
    let formData = new FormData();
    formData.append("title",this.title);
    formData.append("category",this.categories);
    formData.append("sku",this.sku);
    formData.append("price_soles",this.price_soles);
    formData.append("price_usd",this.price_usd);
    formData.append("description",this.description);
    formData.append("resumen",this.resumen);
    formData.append("tags",JSON.stringify(this.tags));
    formData.append("imagen",this.imagen_file);
    
    this._productService.createProducts(formData).subscribe((resp:any)=>{
      console.log(resp);
      if(resp.code == 403){
        this.toaster.open(NoticyAlertComponent,{text:`danger- 'Upps! EL PRODUCTO YA EXISTE, DIGITE OTRO NOMBRE.'`});
        return;
      }else{
        this.toaster.open(NoticyAlertComponent,{text:`primary- 'EL PRODUCTO SE REGISTRÓ CON ÉXITO.'`});
        this.title = null;
        this.categories = null;
        this.sku = null;
        this.price_soles = null;
        this.price_usd = null;
        this.description = null;
        this.resumen = null;
        this.tags = [];
        this.imagen_file = null;
        this.imagen_previsualizacion = null;
        return;
      }
    })
  }
}
