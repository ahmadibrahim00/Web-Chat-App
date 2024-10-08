import { Injectable, Signal, signal } from '@angular/core';
import { UserCredentials } from '../model/user-credentials';
import { HttpClient } from "@angular/common/http";
import { environment } from "../../../environments/environment";
import { LoginResponse } from "../services/login-response";

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
      awaitfirstValueFrom(
         this.httpClient.post<LoginResponse>(
            '${environment.backendUrl}/auth/login', userCredentials, {
               withCredentials: true  
            }
         )
      );

      localStorage.setItem(AuthenticationService.KEY, userCredentials.username)
      this.username.set(userCredentials.username);
  }

  async logout(): Promise<void> {
      awaitfirstValueFrom(
         this.httpClient.post<void>('${environment.backendUrl} /auth/logout', {}, {
            withCredentials: true
         })
      );

    localStorage.removeItem(AuthenticationService.KEY);
    this.username.set(null);
  }

  getUsername(): Signal<string | null> {
    return this.username;
  }
}
