
// src/app/auth.guard.ts

import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authToken = localStorage.getItem('authToken');
  const userRole = localStorage.getItem('userRole');

  console.log('AuthGuard activated for path:', state.url);
  console.log('AuthToken:', authToken ? 'Present' : 'Not Present');
  console.log('User Role (from localStorage):', userRole);

  if (!authToken) {
    console.log('AuthGuard: No token found, redirecting to /login');
    router.navigate(['/login']);
    return false;
  }

  // 2. Szerepkör ellenőrzése
  const expectedRole = route.data['role'] as string;
  console.log('AuthGuard: Expected Role for this route:', expectedRole);

  if (expectedRole && userRole !== expectedRole) {
    console.log(`AuthGuard: Role mismatch. Expected: "<span class="math-inline">\{expectedRole\}", Actual\: "</span>{userRole}". Redirecting to /unauthorized.`);
    router.navigate(['/unauthorized']);
    return false;
  }

  console.log('AuthGuard: Access granted.');
  return true;
};
