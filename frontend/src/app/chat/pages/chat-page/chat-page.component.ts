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
import { FileReaderService } from '../../services/file-reader.service';
import { ChatImageData } from '../../model/message.model';

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
  imageData: ChatImageData | null = null;
  private imageReadPromise: Promise<void> | null = null; // Promise to track image loading

  constructor(
    private messagesService: MessagesService,
    private authenticationService: AuthenticationService,
    private webSocketService: WebSocketService,
    private router: Router,
    private fileReaderService: FileReaderService
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

  selectedImage(file: File | null) {
    if (file) {
      this.imageReadPromise = this.fileReaderService
        .readFile(file)
        .then((data) => {
          this.imageData = data;
        });
    } else {
      this.imageData = null;
      this.imageReadPromise = Promise.resolve();
    }
  }

  async onPublishMessage({ msg, file }: { msg: string; file: File | null }) {
    let imageData: ChatImageData | null = null;

    // If a file is present, read it as base64 using FileReaderService
    if (file) {
      imageData = await this.fileReaderService.readFile(file);
    }

    // Send the message with or without the image data
    if (this.username()) {
      await this.messagesService.postMessage({
        text: msg,
        username: this.username()!,
        imageData,
      });
    }
  }

  async onLogout() {
    await this.authenticationService.logout();
    this.router.navigate(['/']);
  }
}
