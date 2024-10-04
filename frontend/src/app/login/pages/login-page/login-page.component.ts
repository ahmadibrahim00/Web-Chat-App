import { Component, inject } from '@angular/core';
import { LoginFormComponent } from '../../components/login-form/login-form.component';
import { UserCredentials } from '../../model/user-credentials';
import { AuthenticationService } from '../../services/authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css'],
  standalone: true,
  imports: [LoginFormComponent],
})
export class LoginPageComponent {
  router: Router = inject(Router);

  constructor(private authenticationService: AuthenticationService) {}

  onLogin(userCredentials: UserCredentials) {
    this.authenticationService.login(userCredentials);
    this.router.navigate(['/chat']);
  }
}
