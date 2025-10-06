import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Auth } from '../../../core/services/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './register.html'
})
export class Register {
  private auth = inject(Auth);
  private router = inject(Router);

  email = '';
  password = '';

  async onRegister() {
    try {
      const userCredential = await this.auth.register(this.email, this.password);
      console.log('¡Usuario registrado con éxito!', userCredential.user);
      // Más adelante, aquí iniciaremos sesión automáticamente y redirigiremos
      this.router.navigate(['/dashboard']);
    } catch (error) {
      console.error('Error en el registro:', error);
      // Aquí mostraremos un error (ej: la contraseña es muy débil)
    }
  }
}