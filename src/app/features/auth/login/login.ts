import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
// CORRECCIÓN: Importamos RouterModule para que routerLink funcione
import { Router, RouterModule } from '@angular/router'; 
import { Auth } from '../../../core/services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  // CORRECCIÓN: Añadimos RouterModule a la lista de imports
  imports: [FormsModule, RouterModule], 
  templateUrl: './login.html'
})
export class Login {
  private auth = inject(Auth);
  private router = inject(Router); 

  email = '';
  password = '';

  async onLogin() {
    try {
      const userCredential = await this.auth.login(this.email, this.password);
      const profile = await this.auth.getUserProfile(userCredential.user.uid);

      if (profile && profile.role === 'admin') {
        this.router.navigate(['/admin']);
      } else {
        this.router.navigate(['/dashboard']);
      }
    } catch (error) {
      console.error('Error en el inicio de sesión:', error);
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
    } catch (error) { 
      console.error('Error con Google:', error);
      if (error instanceof Error) {
        alert('Error: ' + error.message);
      } else {
        alert('Ha ocurrido un error inesperado al iniciar sesión con Google.');
      }
    }
  }
}