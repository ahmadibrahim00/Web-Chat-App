import { Component, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
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
    username: ['', Validators.required],
    password: ['', Validators.required],
  });

  login = output<UserCredentials>();

  constructor(private fb: FormBuilder) {}

  onLogin() {
    if (this.loginForm.valid) {
      const username = this.loginForm.get('username')!.value as string;
      const password = this.loginForm.get('password')!.value as string;
      const credentials: UserCredentials = { username, password };
  
      this.login.emit(credentials);
    }
  }
}
