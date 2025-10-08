import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { Auth as FirebaseAuth, authState, User } from '@angular/fire/auth';
import { Observable } from 'rxjs';
import { Auth } from '../../../core/services/auth';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    RouterModule,
    AsyncPipe
  ],
  templateUrl: './header.html'
})
export class Header {
  private firebaseAuth: FirebaseAuth = inject(FirebaseAuth);
  private authService: Auth = inject(Auth);
  private router: Router = inject(Router);

  currentUser$: Observable<User | null> = authState(this.firebaseAuth);

  async onLogout() {
    try {
      await this.authService.logout();
      this.router.navigate(['/login']);
      console.log('Sesión cerrada exitosamente.');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  }
}