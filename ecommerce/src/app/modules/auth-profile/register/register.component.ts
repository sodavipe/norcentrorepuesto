import { Component, OnInit } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { Router } from '@angular/router';
declare function alertDanger(message: string): any;
declare function alertWarning(message: string): any;
declare function alertSuccess(message: string): any;

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  email: string = "";
  name: string = "";
  surname: string = "";
  password: string = "";
  repeat_password: string = "";
  isLoading: boolean = false; // To track loading state

  constructor(
    public authServices: AuthService,
    public router: Router,
  ) {}

  ngOnInit(): void {
    if (this.authServices.user) {
      this.router.navigate(['/']);
    }
  }

  validateEmail(email: string): boolean {
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return emailPattern.test(email);
  }

  validatePasswordStrength(password: string): boolean {
    // Example: Require at least 8 characters, one number, one special character
    const passwordPattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W).{8,}$/;
    return passwordPattern.test(password);
  }

  registro() {
    if (!this.email || !this.name || !this.surname || !this.password || !this.repeat_password) {
      alertDanger("¡Todos los campos son requeridos!");
      return;
    }
    if (!this.validateEmail(this.email)) {
      alertDanger("¡Email no válido! Por favor, ingrese un correo electrónico correcto.");
      return;
    }
    if (this.password !== this.repeat_password) {
      alertDanger("¡Las contraseñas deben ser iguales!");
      return;
    }
    if (!this.validatePasswordStrength(this.password)) {
      alertDanger("La contraseña debe tener al menos 8 caracteres, un número, una mayúscula y un carácter especial.");
      return;
    }

    this.isLoading = true; // Start loading

    const data = {
      email: this.email,
      name: this.name,
      surname: this.surname,
      password: this.password,
      rol: 'Cliente',
    };

    this.authServices.registro(data).subscribe(
      (resp: any) => {
        alertSuccess("¡Registro exitoso! Bienvenido.");
        this.router.navigate(['/auth/login']);
      },
      (error: any) => {
        if (error.status === 400 && error.error.message === 'El correo electrónico ya está registrado. Usa otro email.') {
          alertDanger('Este correo ya está registrado. Intenta con otro.');
        } else {
          alertDanger('Ha ocurrido un error durante el registro. Por favor, inténtelo de nuevo.');
        }
      }
    );

  }
}
