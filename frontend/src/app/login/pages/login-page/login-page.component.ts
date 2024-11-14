import { Component, inject } from '@angular/core';
import { LoginFormComponent } from '../../components/login-form/login-form.component';
import { UserCredentials } from '../../model/user-credentials';
import { AuthenticationService } from '../../services/authentication.service';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css'],
  standalone: true,
  imports: [LoginFormComponent],
})
export class LoginPageComponent {
  router: Router = inject(Router);
  errorMessage: string | null = null;

  constructor(private authenticationService: AuthenticationService) {}

  async onLogin(userCredentials: UserCredentials) {
    try {
      await this.authenticationService.login(userCredentials);
      this.router.navigate(['/chat']);
    } catch (error) {
      this.handleError(error);
    }
  }

  handleError(error: unknown) {
    if (error instanceof HttpErrorResponse) {
      if (error.status === 403) {
        this.errorMessage = 'Mot de passe invalide';
      } else {
        this.errorMessage = 'Problème de connexion';
      }
    } else {
      this.errorMessage = 'Erreur inconnue';
    }
  }
}
