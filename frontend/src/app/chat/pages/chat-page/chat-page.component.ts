import { Component } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { AuthenticationService } from 'src/app/login/services/authentication.service';
import { Router } from '@angular/router';
import { MessagesComponent } from '../../components/messages/messages.component';
import { NewMessageFormComponent } from '../../components/new-message-form/new-message-form.component';
import { MessagesService } from '../../services/messages.service';
import { Message } from '../../model/message.model';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';

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
export class ChatPageComponent {
  messages = this.messagesService.getMessages();
  username = this.authenticationService.getUsername();
  messageForm = this.fb.group({
    msg: '',
  });

  constructor(
    private fb: FormBuilder,
    private messagesService: MessagesService,
    private authenticationService: AuthenticationService,
    private router: Router
  ) {}

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
}
