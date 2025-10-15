import { Routes } from '@angular/router';
import { Login } from './features/auth/login/login';
import { Register } from './features/auth/register/register';
import { UserDashboard } from './features/user/user-dashboard/user-dashboard';
import { authGuard } from './core/guards/auth-guard';
import { adminGuard } from './core/guards/admin-guard'; // 1. Importa el nuevo guardián
import { ClassManagement } from './features/admin/class-management/class-management';
export const routes: Routes = [
  // 2. Actualiza la ruta para que use el componente correcto
  { path: 'admin', component: ClassManagement, canActivate: [authGuard, adminGuard] }, 
  { path: 'dashboard', component: UserDashboard, canActivate: [authGuard] },
  { path: 'register', component: Register },
  { path: 'login', component: Login },
  { path: '', redirectTo: 'login', pathMatch: 'full' }
];