import { Component, OnDestroy, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthenticationService } from 'src/app/login/services/authentication.service';
import { MessagesService } from '../../services/messages.service';
import { Router } from '@angular/router';
import { MessagesComponent } from '../../components/messages/messages.component';
import { NewMessageFormComponent } from '../../components/new-message-form/new-message-form.component';
import { MatButtonModule } from '@angular/material/button';
import { Observable, Subscription } from 'rxjs';
import {
  WebSocketEvent,
  WebSocketService,
} from '../../services/websocket.service';

@Component({
  selector: 'app-chat-page',
  templateUrl: './chat-page.component.html',
  styleUrls: ['./chat-page.component.css'],
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MessagesComponent,
    NewMessageFormComponent,
    MatButtonModule,
  ],
})
export class ChatPageComponent implements OnInit, OnDestroy {
  messages = this.messagesService.getMessages();
  username = this.authenticationService.getUsername();

  notifications$: Observable<WebSocketEvent> | null = null;
  notificationsSubscription: Subscription | null = null;

  constructor(
    private messagesService: MessagesService,
    private authenticationService: AuthenticationService,
    private webSocketService: WebSocketService,
    private router: Router
  ) {}

  ngOnInit() {
    this.notifications$ = this.webSocketService.connect();
    this.notificationsSubscription = this.notifications$.subscribe(() => {
      this.messagesService.fetchMessages();
    });

    this.messagesService.fetchMessages();
  }

  ngOnDestroy() {
    if (this.notificationsSubscription) {
      this.notificationsSubscription.unsubscribe();
    }
    this.webSocketService.disconnect();
  }

  async onPublishMessage(message: string) {
    if (this.username() && message) {
      await this.messagesService.postMessage({
        text: message,
        username: this.username()!,
        imageData: null,
      });
    }
  }

  async onLogout() {
    await this.authenticationService.logout();
    this.router.navigate(['/']);
  }
}
