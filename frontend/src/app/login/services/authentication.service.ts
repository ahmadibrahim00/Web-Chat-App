import { Injectable, Signal, signal } from '@angular/core';
import { UserCredentials } from '../model/user-credentials';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { LoginResponse } from '../model/login-response';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  static LOGIN_PATH = '/auth/login';
  static LOGOUT_PATH = '/auth/logout';
  static KEY = 'username';

  private username = signal<string | null>(null);

  constructor(private httpClient: HttpClient) {
    this.username.set(localStorage.getItem(AuthenticationService.KEY));
  }

  async login(userCredentials: UserCredentials) {
    const response = await firstValueFrom(
      this.httpClient.post<LoginResponse>(
        `${environment.backendURL}${AuthenticationService.LOGIN_PATH}`,
        userCredentials,
        { withCredentials: true }
      )
    );
    localStorage.setItem(AuthenticationService.KEY, response.username);
    this.username.set(response.username);
  }

  async logout() {
    await firstValueFrom(
      this.httpClient.post(
        `${environment.backendURL}${AuthenticationService.LOGOUT_PATH}`,
        null,
        {
          withCredentials: true,
        }
      )
    );
    localStorage.removeItem(AuthenticationService.KEY);
    this.username.set(null);
  }

  getUsername(): Signal<string | null> {
    return this.username;
  }
}
