import { Routes } from '@angular/router';
import { UserDashboard } from './features/user/user-dashboard/user-dashboard';
import { authGuard } from './core/guards/auth-guard';
import { adminGuard } from './core/guards/admin-guard';
import { ClassManagement } from './features/admin/class-management/class-management';
import { Landing } from './features/landing/landing';
import { Login } from './features/auth/login/login';
import { Register } from './features/auth/register/register';

export const routes: Routes = [
  {
    path: '',
    component: Landing,
    children: [
      { path: 'login', component: Login },
      { path: 'register', component: Register }
    ]
  },

  { path: 'admin', component: ClassManagement, canActivate: [authGuard, adminGuard] }, 
  { path: 'dashboard', component: UserDashboard, canActivate: [authGuard] },

    { path: '**', redirectTo: '', pathMatch: 'full' }
];

