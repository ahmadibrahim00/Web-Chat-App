import { Injectable, Signal, signal } from '@angular/core';
import { Message } from '../model/message.model';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment.development';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MessagesService {
  private messagesSignal = signal<Message[]>([]);
  private lastScrollPosition = 0;
  private pollingInterval: any;

  constructor(private httpClient: HttpClient) {}

  getMessages(): Signal<Message[]> {
    return this.messagesSignal;
  }

  async postMessage(message: Message): Promise<void> {
    await firstValueFrom(
      this.httpClient.post<Message>(
        `${environment.backendURL}/messages`,
        message,
        { withCredentials: true }
      )
    );
    this.fetchMessages(true);
  }

  startPolling(): void {
    this.fetchMessages(false);
  }

  stopPolling(): void {
    if (this.pollingInterval) {
      clearInterval(this.pollingInterval);
      this.pollingInterval = null;
      this.messagesSignal.set([]);
    }
  }

  async fetchMessages(isNewMessage: boolean): Promise<void> {
    try {
      const messages = await firstValueFrom(
        this.httpClient.get<Message[]>(`${environment.backendURL}/messages`, {
          params: { limit: '1000' }, // Request more messages
          withCredentials: true
        })
      );
      
      this.messagesSignal.set(messages.reverse());
      
      if (!isNewMessage) {
        setTimeout(() => {
          const scrollElement = document.querySelector('.messages-container');
          if (scrollElement) {
            scrollElement.scrollTop = this.lastScrollPosition;
          }
        }, 0);
      } else {
        setTimeout(() => {
          const scrollElement = document.querySelector('.messages-container');
          if (scrollElement) {
            scrollElement.scrollTop = scrollElement.scrollHeight;
          }
        }, 0);
      }
    } catch (error: any) {
      if (error.status === 403) {
        this.stopPolling();
      }
    }
  }
}

