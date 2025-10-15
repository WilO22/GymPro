// --- SECCIÓN DE IMPORTACIONES: Cargamos las herramientas necesarias ---

// Importamos 'Component' (decorador) y 'inject' (función) del núcleo de Angular.
import { Component, inject } from '@angular/core';
// Importamos 'FormsModule' para habilitar las directivas de formularios de Angular, como ngModel.
import { FormsModule } from '@angular/forms';
// Importamos nuestro servicio 'Auth' para poder comunicarnos con Firebase.
import { Auth } from '../../../core/services/auth';
import { Router } from '@angular/router';

// --- DEFINICIÓN DEL COMPONENTE ---

// El decorador '@Component' configura esta clase como un componente de Angular.
@Component({
  // 'selector' define la etiqueta HTML personalizada para usar este componente: <app-login></app-login>.
  selector: 'app-login',
  // 'standalone: true' indica que este componente gestiona sus propias dependencias.
  standalone: true,
  // 'imports' declara las dependencias que la plantilla de este componente necesita.
  imports: [FormsModule],
  // 'templateUrl' especifica la ruta al archivo HTML que contiene la vista de este componente.
  templateUrl: './login.html'
})
// Exportamos la clase 'Login' para que pueda ser utilizada en otras partes de la aplicación.
export class Login {
  // Inyectamos la instancia singleton de nuestro servicio de autenticación usando la función 'inject'.
  private auth = inject(Auth);

  private router = inject(Router); 

  // Definimos propiedades públicas que se enlazarán a los campos del formulario en el HTML.
  email = '';
  password = '';

  // --- MÉTODO QUE SE EJECUTA AL ENVIAR EL FORMULARIO DE LOGIN ---
  // La palabra clave 'async' indica que esta función manejará operaciones asíncronas.
  async onLogin() {
    try {
      const userCredential = await this.auth.login(this.email, this.password);
      const profile = await this.auth.getUserProfile(userCredential.user.uid);

      if (profile && profile.role === 'admin') {
        this.router.navigate(['/admin']);
      } else {
        this.router.navigate(['/dashboard']);
      }
    } catch (error) { // 'error' es de tipo 'unknown'
      console.error('Error en el inicio de sesión:', error);
      // 1. Comprobamos si el error es una instancia de Error
      if (error instanceof Error) {
        alert('Error: ' + error.message);
      } else {
        alert('Ha ocurrido un error inesperado.');
      }
    }
  }

  async onLoginWithGoogle() {
    try {
      const userCredential = await this.auth.loginWithGoogle();
      const profile = await this.auth.getUserProfile(userCredential.user.uid);

      if (profile && profile.role === 'admin') {
        this.router.navigate(['/admin']);
      } else {
        this.router.navigate(['/dashboard']);
      }
    } catch (error) { // 'error' también es de tipo 'unknown' aquí
      console.error('Error con Google:', error);
      // 2. Hacemos la misma comprobación
      if (error instanceof Error) {
        alert('Error: ' + error.message);
      } else {
        alert('Ha ocurrido un error inesperado al iniciar sesión con Google.');
      }
    }
  }
}