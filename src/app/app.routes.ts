import { Routes } from '@angular/router';
import { UserDashboard } from './features/user/user-dashboard/user-dashboard';
import { authGuard } from './core/guards/auth-guard';
import { adminGuard } from './core/guards/admin-guard';
import { ClassManagement } from './features/admin/class-management/class-management';
import { Landing } from './features/landing/landing';
import { Login } from './features/auth/login/login';
import { Register } from './features/auth/register/register';

// Ya no necesitaremos el AuthLayout, así que lo puedes eliminar si quieres.

export const routes: Routes = [
  // --- ¡MODIFICACIÓN CLAVE! ---
  {
    path: '',
    component: Landing, // LandingComponent siempre será la base...
    children: [
      // ...y si la URL es /login o /register, estos componentes se renderizarán DENTRO de LandingComponent.
      { path: 'login', component: Login },
      { path: 'register', component: Register }
    ]
  },

  // Las rutas protegidas se mantienen igual.
  { path: 'admin', component: ClassManagement, canActivate: [authGuard, adminGuard] }, 
  { path: 'dashboard', component: UserDashboard, canActivate: [authGuard] },
  
  // La ruta comodín se mantiene al final.
  { path: '**', redirectTo: '', pathMatch: 'full' }
];