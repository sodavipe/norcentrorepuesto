import { Component, OnInit } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { Router } from '@angular/router';
declare function alertDanger([]):any;
declare function alertWarning([]):any;
declare function alertSuccess([]):any;

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  email:string = "";
  name:string = "";
  surname:string = "";
  password:string = "";
  repeat_password:string = "";
  constructor(
    public authServices: AuthService,
    public router: Router,
  ) {}

  ngOnInit(): void {
    if(this.authServices.user){
      this.router.navigate(["/"]);
    }
  }
  validateEmail(email: string): boolean {
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return emailPattern.test(email);
  }

  registro(){

    if(
      !this.email ||
      !this.name ||
      !this.surname ||
      !this.password ||
      !this.repeat_password
    ){ alertDanger("TODOS LOS CAMPOS SON REQUERIDOS!");
      return;
    }
    if (!this.validateEmail(this.email)) {
      alertDanger("EMAIL NO VÁLIDO! Por favor, ingrese un correo electrónico correcto.");
      return;
    }
    if(this.password != this.repeat_password){
      alertDanger("LAS CONTRASEÑAS DEBEN SER IGUALES!");
      return;
    }
    let data ={
      email:this.email,
      name:this.name,
      surname:this.surname,
      password:this.password,
      rol: 'Cliente',
    }
    this.authServices.registro(data).subscribe((resp:any)=>{
      console.log(resp);
    }
    , (error: any) => {
      console.error('Error during registration:', error);
      alertDanger('Ha ocurrido un error durante el registro. Por favor, inténtelo de nuevo.');}
  );
  }

}
