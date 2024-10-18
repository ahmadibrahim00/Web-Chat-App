import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { AuthenticationService } from 'src/app/login/services/authentication.service';
import { Router } from '@angular/router';
import { MessagesComponent } from '../../components/messages/messages.component';
import { NewMessageFormComponent } from '../../components/new-message-form/new-message-form.component';
import { MessagesService } from '../../services/messages.service';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { Message } from '../../model/message.model';
import { Subscription } from 'rxjs';
import { WebSocketService } from '../../services/websocket.service';

@Component({
  selector: 'app-chat-page',
  templateUrl: './chat-page.component.html',
  styleUrls: ['./chat-page.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    DatePipe,
    MessagesComponent,
    NewMessageFormComponent,
    ReactiveFormsModule,
    MatButtonModule,
  ],
})
export class ChatPageComponent implements OnInit, OnDestroy {
  messages = this.messagesService.getMessages();
  username = this.authenticationService.getUsername();
  private wsSubscription: Subscription = new Subscription();
  messageForm = this.fb.group({
    msg: '',
  });

  constructor(
    private fb: FormBuilder,
    private messagesService: MessagesService,
    private authenticationService: AuthenticationService,
    private router: Router,
    private websocketService: WebSocketService
  ) {}

  // Lorsque l'on change de page va chercher les messages
  // et à chaque 3 secondes charge les nouveaux messages
  ngOnInit() {
    this.messagesService.fetchMessages();
    this.wsSubscription = this.websocketService.connect().subscribe((event) => {
      if (event == 'notif') {
        this.messagesService.fetchMessages();
      }
    });
  }

  showDateHeader(messages: Message[] | null, i: number) {
    if (messages != null) {
      if (i === 0) {
        return true;
      } else {
        const prev = new Date(messages[i - 1].timestamp).setHours(0, 0, 0, 0);
        const curr = new Date(messages[i].timestamp).setHours(0, 0, 0, 0);
        return prev != curr;
      }
    }
    return false;
  }

  async onLogout() {
    await this.authenticationService.logout();
    this.router.navigate(['/']);
  }

  ngOnDestroy(): void {
    // Quand le componenet n'est plus utilisé, unsub
    if (this.wsSubscription) {
      this.wsSubscription.unsubscribe();
    }
  }
}
