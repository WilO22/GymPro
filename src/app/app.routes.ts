import { Routes } from '@angular/router';
import { Login } from './features/auth/login/login';
import { Register } from './features/auth/register/register';
import { UserDashboard } from './features/user/user-dashboard/user-dashboard';

export const routes: Routes = [
  { path: 'dashboard', component: UserDashboard },

  { path: 'register', component: Register },
  { path: 'login', component: Login },
  { path: '', redirectTo: 'login', pathMatch: 'full' }
];