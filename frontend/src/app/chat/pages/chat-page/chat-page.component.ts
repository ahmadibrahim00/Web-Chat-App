import { Component, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { AuthenticationService } from 'src/app/login/services/authentication.service';
import { Message } from '../../model/message.model';
import { MessagesService } from '../../services/messages.service';
import { ChatAffichageComponent } from './chat-affichage/chat-affichage.component';
import { ChatPublierComponent } from './chat-publier/chat-publier.component';

@Component({
  selector: 'app-chat-page',
  templateUrl: './chat-page.component.html',
  styleUrls: ['./chat-page.component.css'],
  standalone: true,
  imports: [ReactiveFormsModule, DatePipe],
})
export class ChatPageComponent {
  messages = signal<Message[]>([]);
  username = this.authenticationService.getUsername();

  messageForm = this.fb.group({
    msg: '',
  });

  constructor(
    private fb: FormBuilder,
    private messagesService: MessagesService,
    private authenticationService: AuthenticationService
  ) {}

  onPublishMessage() {
    if (
      this.username() &&
      this.messageForm.valid &&
      this.messageForm.value.msg
    ) {
      this.messagesService.postMessage({
        text: this.messageForm.value.msg,
        username: this.username()!,
        timestamp: Date.now(),
      });
    }
    this.messageForm.reset();
  }

  /** Afficher la date seulement si la date du message précédent est différente du message courant. */
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

  onLogout() {
    // À faire
  }
}
