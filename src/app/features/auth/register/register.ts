import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
// CORRECCIÓN: Importamos RouterModule para que routerLink funcione
import { Router, RouterModule } from '@angular/router';
import { Auth } from '../../../core/services/auth';

@Component({
  selector: 'app-register',
  standalone: true,
  // CORRECCIÓN: Añadimos RouterModule a la lista de imports
  imports: [FormsModule, RouterModule], 
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
      this.router.navigate(['/dashboard']);
    } catch (error) {
      console.error('Error en el registro:', error);
    }
  }
}