import { Routes } from '@angular/router';
import { LoginComponent } from './core/auth/pages/login/login.component';
import { HomeComponent } from './pages/home/home.component';
import { RegisterComponent } from './core/auth/pages/register/register.component';

export const routes: Routes = [
  { path: '*', redirectTo: '/', pathMatch: 'full' },
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
];