import { CanActivateFn, Router } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';
import { inject } from '@angular/core';

export const loginPageGuard: CanActivateFn = () => {
  const authenticationService = inject(AuthenticationService);
  const router = inject(Router);

  if (authenticationService.isConnected()) {
    return router.parseUrl('/chat');
  }

  return true;
};
