import {Routes} from '@angular/router';
import {LoginComponent} from './login/login.component';
import {RegisterComponent} from './register/register.component';
import {OperatorDashboardComponent} from './operator-dashboard/operator-dashboard.component';
import {MechanicDashboardComponent} from './mechanic-dashboard/mechanic-dashboard.component';
import {authGuard} from './auth.guard';
import {UnauthorizedComponent} from './unauthorized/unauthorized.component';


export const routes: Routes = [
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full',
  },
  {
    path: 'register',
    component: RegisterComponent
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'mechanic-dashboard',
     component: MechanicDashboardComponent,
    canActivate: [authGuard],
    data:{role: 'MECHANIC'}
  },

  {
    path: 'operator-dashboard',
    component: OperatorDashboardComponent,
    canActivate:[authGuard],
    data:{role:'OPERATOR'}
  },
  { path: 'unauthorized',
    component: UnauthorizedComponent },

];
