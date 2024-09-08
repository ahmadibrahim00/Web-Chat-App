import { Component, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { UserCredentials } from '../../model/user-credentials';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.css'],
  standalone: true,
  imports: [ReactiveFormsModule],
})
export class LoginFormComponent {
  loginForm = this.fb.group({
    username: '',
    password: '',
  });

  login = output<UserCredentials>();

  constructor(private fb: FormBuilder) {}

  onLogin() {
    const usernameControl = this.loginForm.get('username');
    const passwordControl = this.loginForm.get('password');

    if (usernameControl && passwordControl && usernameControl.value && passwordControl.value) {
        const username = usernameControl.value;
        const password = passwordControl.value;

        const credentials: UserCredentials = { username, password };

        this.login.emit(credentials);
    }
  }
}
