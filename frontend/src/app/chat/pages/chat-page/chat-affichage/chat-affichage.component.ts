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
@Input() messages: Message[] = [];
}
