import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';

export type WebSocketEvent = 'notif' | 'connected';

@Injectable({
  providedIn: 'root',
})
export class WebSocketService {
  private ws: WebSocket | null = null;
  private events: Subject<WebSocketEvent> = new Subject<WebSocketEvent>();
  private reconnectDelay = 2000; // Delay in milliseconds (2 seconds)
  private isReconnecting = false;
  private shouldReconnect = true;

  public connect(): Observable<WebSocketEvent> {
    if (this.events.closed) {
      this.events = new Subject<WebSocketEvent>();
    }

    // Set shouldReconnect to true whenever we initiate a connection
    this.shouldReconnect = true;
    this.createWebSocket();

    return this.events.asObservable();
  }

  private createWebSocket() {
    this.ws = new WebSocket(`${environment.wsURL}/notifications`);
    this.ws.onopen = () => this.events.next('notif');
    this.ws.onmessage = () => this.events.next('notif');
    this.ws.onclose = () => {
      if (this.shouldReconnect) {
        this.handleReconnect();
      }
    };

    this.ws.onerror = () => {
      if (this.shouldReconnect) {
        this.handleReconnect();
      }
    };
  }

  private handleReconnect() {
    if (!this.isReconnecting) {
      this.isReconnecting = true;
      setTimeout(() => {
        this.isReconnecting = false;
        if (this.ws) {
          this.ws.close();
          this.ws = null;
        }
        this.createWebSocket();
      }, this.reconnectDelay);
    }
  }

  public disconnect() {
    this.shouldReconnect = false; // Prevent reconnection when disconnecting manually
    this.ws?.close();
    this.ws = null;
  }
}
