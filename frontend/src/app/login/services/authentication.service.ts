import { Injectable, Signal, signal } from '@angular/core';
import { UserCredentials } from '../model/user-credentials';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { LoginResponse } from '../services/login-response';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  static KEY = 'username';

  private username = signal<string | null>(null);

  constructor(private httpClient: HttpClient) {
    this.username.set(localStorage.getItem(AuthenticationService.KEY));
  }

  async login(userCredentials: UserCredentials): Promise<void> {
    await firstValueFrom(
      this.httpClient.post<LoginResponse>(
        `${environment.backendURL}/auth/login`,
        userCredentials,
        {
          withCredentials: true,
        }
      )
    ).then((response) => {
      localStorage.setItem(AuthenticationService.KEY, response.username);
      this.username.set(response.username);
    });
  }

  async logout(): Promise<void> {
    await firstValueFrom(
      this.httpClient.post<void>(
        `${environment.backendURL}/auth/logout`,
        {},
        {
          withCredentials: true,
        }
      )
    ).then(() => {
      localStorage.removeItem(AuthenticationService.KEY);
      this.username.set(null);
    });
  }

  getUsername(): Signal<string | null> {
    return this.username;
  }
}
