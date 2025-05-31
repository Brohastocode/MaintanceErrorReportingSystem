import {Routes} from '@angular/router';
import {LoginComponent} from './login/login.component';
import {RegisterComponent} from './register/register.component';
import {OperatorDashboardComponent} from './dashboards/operator-dashboard/operator-dashboard.component';
import {MechanicDashboardComponent} from './dashboards/mechanic-dashboard/mechanic-dashboard.component';
import {authGuard} from './auth.guard';
import {UnauthorizedComponent} from './unauthorized/unauthorized.component';
import {AdminDashboardComponent} from './dashboards/admin-dashboard/admin-dashboard.component';
import {AdminUserListComponent} from './admin-components/admin-user-list/admin-user-list.component';
import {AdminDeviceListComponent} from './admin-components/admin-device-list/admin-device-list.component';



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
  {
    path: 'admin-dashboard',
    component: AdminDashboardComponent,
    canActivate:[authGuard],
    data:{role:'ADMIN'},
    children: [
      { path: 'users', component: AdminUserListComponent },
      { path: 'devices', component: AdminDeviceListComponent },
      { path: '', redirectTo: 'admin-dashboard', pathMatch: 'full' }
    ]
  },
  { path: 'unauthorized',
    component: UnauthorizedComponent },

];
