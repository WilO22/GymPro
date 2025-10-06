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
    // El bloque 'try...catch' es un mecanismo para manejar errores de forma controlada.
    try {
      // 'await' pausa la ejecución hasta que la promesa del método 'login' se resuelva.
      const userCredential = await this.auth.login(this.email, this.password);
      // Si el login es exitoso, lo mostramos en la consola. Más adelante aquí habrá una redirección.
      this.router.navigate(['/dashboard']);

      console.log('¡Inicio de sesión exitoso!', userCredential.user);
    } catch (error) {
      // Si el método 'login' falla (ej: contraseña incorrecta), el error se captura aquí.
      console.error('Error en el inicio de sesión:', error);
    }
  }

  // --- MÉTODO PARA INICIAR SESIÓN CON GOOGLE ---
  async onLoginWithGoogle() {
    try {
      // Esperamos a que el proceso de login con Google a través del popup se complete.
      const userCredential = await this.auth.loginWithGoogle();
      console.log('¡Inicio de sesión con Google exitoso!', userCredential.user);
      this.router.navigate(['/dashboard']);
    } catch (error) {
      // Manejamos cualquier error que pueda ocurrir durante el proceso (ej: el usuario cierra el popup).
      console.error('Error con Google:', error);
    }
  }
}