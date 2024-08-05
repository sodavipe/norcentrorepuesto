import { Component, OnInit } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { Router } from '@angular/router';
declare function alertDanger([]):any;
declare function alertWarning([]):any;
declare function alertSuccess([]):any;
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  email:string = "";
  password:string = "";

  constructor(
    public authService: AuthService,
    public router: Router
  ) { }

  ngOnInit(): void {
    //console.log(this.authService.user);
    if(this.authService.user){
      this.router.navigate(["/"]);
    }
  }

  login(){

    if(!this.email){
      alertDanger("ES NECESARIO INGRESAR EL EMAIL!");
      return;
    }

    if(!this.password){
      alertDanger("ES NECESARIO INGRESAR UNA CONTRASEÑA!");
      return;
    }

    this.authService.login(this.email,this.password).subscribe((resp:any)=>{
      console.log(resp);
      if(!resp.error && resp){
        //EL USUARIO INGRESÓ CON ÉXITO
        // this.router.navigate(["/"])
        location.reload();
      }else{
        alertDanger(resp.error.message);
      }
    })
  }
}
