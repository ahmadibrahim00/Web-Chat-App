import { Injectable, Signal, signal } from '@angular/core';
import { Message } from '../model/message.model';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment.development';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MessagesService {
  messages = signal<Message[]>([]);
  lastId = -1;

  constructor(private httpClient: HttpClient) {}

  async postMessage(message: Message): Promise<void> {
    await firstValueFrom(
      this.httpClient.post<Message>(
        `${environment.backendURL}/messages`,
        message,
        { withCredentials: true }
      )
    );
  }

  getMessages(): Signal<Message[]> {
    return this.messages;
  }

  async fetchMessages(): Promise<void> {
    const params = new HttpParams().set('id', this.lastId);
    await firstValueFrom(
      this.httpClient.get<Message[]>(`${environment.backendURL}/messages`, {
        params,
        withCredentials: true,
      })
    ).then((newMessages) => {
      if (newMessages.length > 0) {
        const currentMessages = this.messages();
        this.messages.set([...currentMessages, ...newMessages]);
        this.lastId = newMessages[newMessages.length - 1].id;
      }
    });
  }
}
