import { Injectable, Signal, signal } from '@angular/core';
import { Message, NewMessageRequest } from '../model/message.model';
import { HttpClient, HttpParams } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class MessagesService {
  messages = signal<Message[]>([]);

  private lastMessageId: string | null = null;

  constructor(private httpClient: HttpClient) {}

  async postMessage(message: NewMessageRequest): Promise<Message> {
    return firstValueFrom(
      this.httpClient.post<Message>(
        `${environment.backendURL}/messages`,
        message,
        {
          withCredentials: true,
        }
      )
    );
  }

  async fetchMessages() {
    const queryParameters =
      this.lastMessageId != null
        ? new HttpParams().set('fromId', this.lastMessageId)
        : new HttpParams();

    const messages = await firstValueFrom(
      this.httpClient.get<Message[]>(`${environment.backendURL}/messages`, {
        params: queryParameters,
        withCredentials: true,
      })
    );
    this.messages.update((previousMessages) => [
      ...previousMessages,
      ...messages,
    ]);
  }

  getMessages(): Signal<Message[]> {
    return this.messages;
  }
}
