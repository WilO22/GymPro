import { Routes } from '@angular/router';
import { Login } from './features/auth/login/login';
import { Register } from './features/auth/register/register';
import { UserDashboard } from './features/user/user-dashboard/user-dashboard';
import { authGuard } from './core/guards/auth-guard';
import { adminGuard } from './core/guards/admin-guard'; // 1. Importa el nuevo guardián
import { ClassManagement } from './features/admin/class-management/class-management';
import { Landing } from './features/landing/landing';
// --- ¡NUEVO! --- Importamos nuestro nuevo componente de layout.
import { AuthLayout } from './features/auth/auth-layout/auth-layout';

export const routes: Routes = [
 
  // { path: '', component: Landing },
  // { path: 'admin', component: ClassManagement, canActivate: [authGuard, adminGuard] }, 
  // { path: 'dashboard', component: UserDashboard, canActivate: [authGuard] },
  // { path: 'register', component: Register },
  // { path: 'login', component: Login },
  // { path: '**', redirectTo: '', pathMatch: 'full' }

  { path: '', component: Landing },
  
  // --- ¡MODIFICADO! --- Creamos una ruta padre para el layout.
  {
    path: '',
    component: AuthLayout, // Este componente se renderizará primero...
    children: [
      // ...y luego, dentro de su <router-outlet>, se renderizará uno de estos hijos.
      { path: 'login', component: Login },
      { path: 'register', component: Register }
    ]
  },

  { path: 'admin', component: ClassManagement, canActivate: [authGuard, adminGuard] }, 
  { path: 'dashboard', component: UserDashboard, canActivate: [authGuard] },
  
  // Eliminamos las rutas planas de login y register de aquí porque ahora están anidadas.
  
  { path: '**', redirectTo: '', pathMatch: 'full' }
];