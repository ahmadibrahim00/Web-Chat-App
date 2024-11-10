import { Component, input, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserCredentials } from '../../model/user-credentials';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
})
export class LoginFormComponent {
  loginForm = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required],
  });

  errorMessage = input<string | null>();
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
