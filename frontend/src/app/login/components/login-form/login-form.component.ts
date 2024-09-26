import { Component, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { UserCredentials } from '../../model/user-credentials';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.css'],
  standalone: true,
  imports: [ReactiveFormsModule, MatFormFieldModule,MatInputModule, ReactiveFormsModule],
})
export class LoginFormComponent {
  loginForm = this.fb.group({
    username: '',
    password: '',
  });

  login = output<UserCredentials>();

  constructor(private fb: FormBuilder) {}

  onLogin() {
    // À faire
  }
}
