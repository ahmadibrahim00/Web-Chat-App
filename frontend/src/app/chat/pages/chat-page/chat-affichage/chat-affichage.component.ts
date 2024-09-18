import { Component, Input } from '@angular/core';
import { Message } from '../../../model/message.model';

@Component({
  selector: 'app-chat-affichage',
  standalone: true,
  imports: [],
  templateUrl: './chat-affichage.component.html',
  styleUrl: './chat-affichage.component.css'
})
export class ChatAffichageComponent {
   //Recevoir les messages
@Input() messages: Message[] = [];
// La méthode showDateHeader de chat-page
showDateHeader(messages: Message[], i: number): boolean {
    if (i === 0) {
      return true;
    }
    const prev = new Date(messages[i - 1].timestamp).setHours(0, 0, 0, 0);
    const curr = new Date(messages[i].timestamp).setHours(0, 0, 0, 0);
    return prev !== curr;
  }
}
