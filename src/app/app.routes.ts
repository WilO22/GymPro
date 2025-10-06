// import { Routes } from '@angular/router';

// export const routes: Routes = [];

import { Routes } from '@angular/router';
import { Login } from './features/auth/login/login'; // ¡Importamos nuestro componente!

export const routes: Routes = [
  // Cuando la URL sea /login, muestra el componente Login
  { path: 'login', component: Login },

  // Si la URL está vacía (la página de inicio), redirige a /login por ahora
  { path: '', redirectTo: 'login', pathMatch: 'full' }
];