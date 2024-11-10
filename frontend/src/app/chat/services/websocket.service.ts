import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { MessagesService } from './messages.service';

export type WebSocketEvent = 'notif';

@Injectable({
  providedIn: 'root',
})
export class WebSocketService {
  private ws: WebSocket | null = null;
  private events: Subject<WebSocketEvent> = new Subject<WebSocketEvent>();
  private reconnectDelay = 2000; // Delay in milliseconds (2 seconds)
  private isReconnecting = false;

  constructor(private messagesService: MessagesService) {}

  public connect(): Observable<WebSocketEvent> {
    if (!this.ws) {
      this.createWebSocket(); // Create WebSocket only if it's not already created
    }
    return this.events.asObservable();
  }

  private createWebSocket() {
    this.ws = new WebSocket(`${environment.wsURL}/notifications`);

    this.ws.onopen = () => {
      console.log('WebSocket connection established');
      this.events.next('notif');
    };
    this.ws.onmessage = () => this.events.next('notif');
    this.ws.onclose = () => {
      console.log('WebSocket connection closed. Reconnecting...');
      this.handleReconnect();
    };
    this.ws.onerror = () => {
      console.error('WebSocket error. Reconnecting...');
      this.handleReconnect();
    };
  }

  private handleReconnect() {
    if (!this.isReconnecting) {
      this.isReconnecting = true;
      setTimeout(() => {
        this.isReconnecting = false;
        if (this.ws) {
          this.ws.close();
          this.createWebSocket();
        }
      }, this.reconnectDelay);
    }
  }

  public disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.events.complete();
  }
}
