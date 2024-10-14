import { Injectable, Signal, signal } from '@angular/core';
import { Message } from '../model/message.model';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment.development';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MessagesService {
  messages = signal<Message[]>([]);

  constructor(private httpClient: HttpClient) {}

  async postMessage(message: Message): Promise<void> {
    const currentMessages = this.messages();
    await firstValueFrom(
      this.httpClient.post<Message>(
        `${environment.backendURL}/messages`,
        message,
        { withCredentials: true }
      )
    ).then((newMessage) => {
      this.messages.set([...currentMessages, newMessage]);
      console.log(newMessage);
    });
  }

  getMessages(): Signal<Message[]> {
    return this.messages;
  }
}
