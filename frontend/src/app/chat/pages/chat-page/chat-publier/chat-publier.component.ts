import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MessagesService } from '../../services/messages.service';
import { AuthenticationService } from 'src/app/login/services/authentication.service';

@Component({
  selector: 'app-chat-publier',
  standalone: true,
  imports: [],
  templateUrl: './chat-publier.component.html',
  styleUrl: './chat-publier.component.css'
})
export class ChatPublierComponent {
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



}
