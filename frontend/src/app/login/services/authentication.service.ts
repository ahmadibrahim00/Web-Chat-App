import { Injectable, Signal, signal } from '@angular/core';
import { UserCredentials } from '../model/user-credentials';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { LoginResponse } from '../services/login-response';
import { firstValueFrom } from 'rxjs';
import { MessagesService } from "../../chat/services/messages.service";

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  static KEY = 'username';
  private username = signal<string | null>(null);

  constructor(
    private httpClient: HttpClient, 
    private messagesService: MessagesService
  ) {
    const savedUsername = localStorage.getItem(AuthenticationService.KEY);
    if (savedUsername) {
      this.username.set(savedUsername);
      this.messagesService.startPolling();
    }
  }

  async login(userCredentials: UserCredentials): Promise<void> {
    const response = await firstValueFrom(
      this.httpClient.post<LoginResponse>(
        `${environment.backendURL}/auth/login`,
        userCredentials,
        { withCredentials: true }
      )
    );
    
    localStorage.setItem(AuthenticationService.KEY, response.username);
    this.username.set(response.username);
    this.messagesService.startPolling();
  }

  async logout(): Promise<void> {
    await firstValueFrom(
      this.httpClient.post<void>(
        `${environment.backendURL}/auth/logout`,
        {},
        { withCredentials: true }
      )
    );
    
    localStorage.removeItem(AuthenticationService.KEY);
    this.username.set(null);
    this.messagesService.stopPolling();
  }

  getUsername(): Signal<string | null> {
    return this.username;
  }
}

