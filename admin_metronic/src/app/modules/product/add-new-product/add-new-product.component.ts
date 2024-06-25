import { Component, OnInit } from '@angular/core';
import { Toaster } from 'ngx-toast-notifications';
import { NoticyAlertComponent } from 'src/app/componets/notifications/noticy-alert/noticy-alert.component';
import { ProductService } from '../_services/product.service';
import { CategoriesService } from '../../categories/_services/categories.service';
import { ExchangeRateServiceService } from '../_services/exchange-rate-service.service';

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

  //

  skus:any = [];
  exchangeRate: number = 0;

  constructor(
    public _productService:ProductService,
    public _CategoryService:CategoriesService,
    public toaster:Toaster,
    public exchangeRateService:ExchangeRateServiceService
  ) { }

  ngOnInit(): void {
    this.isLoading$ = this._productService.isLoading$;
    this._CategoryService.allCategories().subscribe((resp:any)=>{
      console.log(resp);
      this.category = resp.category;
      this.loadServices();
    })
    // Genera el SKU al iniciar el componente
    this.generateSKU();
    this.loadExchangeRate();
  }
  loadExchangeRate(){
    this.exchangeRateService.getExchangeRate().subscribe((data: any) => {
      this.exchangeRate = data.rates.USD; // Asegúrate de que esta es la forma correcta de acceder a la tasa de cambio USD
    });
  }
  generateSKU() {
    let sku;
    do {
      const now = new Date();
      sku = `SKU-${now.getFullYear()}${(now.getMonth() + 1).toString().padStart(2, '0')}${now.getDate().toString().padStart(2, '0')}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    } while (this.skus.includes(sku));
    this.skus.push(sku);
    this.sku = sku;
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
  onPriceSolesChange() {
    if (this.exchangeRate > 0) {
      this.price_usd = (this.price_soles / this.exchangeRate).toFixed(2);
    }
  }
  removeTag(i){
    this.tags.splice(i,1);
  }
  validateNumberInput(event: KeyboardEvent) {
    const pattern = /[0-9\.]/;
    const inputChar = String.fromCharCode(event.charCode);

    if (!pattern.test(inputChar)) {
      // Si el carácter no es un número o un punto, evita que se introduzca
      event.preventDefault();
    }

    if (inputChar === '.' && (this.price_soles || '').toString().includes('.')) {
      // Si ya hay un punto en el valor, evita que se introduzca otro
      event.preventDefault();
    }
  }
  validateInput(event: any) {
    const pattern = /^[0-9]*\.?[0-9]*$/;
    if (!pattern.test(event.target.value)) {
      event.target.value = event.target.value.replace(/[^0-9\.]/g, '');
      this.price_soles = event.target.value; // Asegúrate de que el modelo se actualice
    }
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


        this.generateSKU();
        return;
      }
    })
  }
}
