import { Component, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { AuthenticationService } from 'src/app/login/services/authentication.service';
import { Router } from '@angular/router';
import { MessagesComponent } from "../../components/messages/messages.component";
import { NewMessageFormComponent } from "../../components/new-message-form/new-message-form.component";

@Component({
  selector: 'app-chat-page',
  templateUrl: './chat-page.component.html',
  styleUrls: ['./chat-page.component.css'],
  standalone: true,
  imports: [DatePipe, MessagesComponent, NewMessageFormComponent],
})
export class ChatPageComponent {
  router: Router = inject(Router);

  constructor(
    private authenticationService: AuthenticationService
  ) {}


  onLogout() {
    this.authenticationService.logout();
    this.router.navigate(['/']);
  }
}
