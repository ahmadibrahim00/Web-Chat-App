import { Component, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormField } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-new-message-form',
  standalone: true,
  imports: [ReactiveFormsModule, MatFormField, MatInputModule, MatButtonModule],
  templateUrl: './new-message-form.component.html',
  styleUrl: './new-message-form.component.css',
})
export class NewMessageFormComponent {
  messageForm = this.fb.group({
    msg: '',
  });

  publishMessage = output<string>();

  constructor(private fb: FormBuilder) {}

  onPublishMessage() {
    if (this.messageForm.valid && this.messageForm.value.msg) {
      this.publishMessage.emit(this.messageForm.value.msg);
      this.messageForm.reset();
    }
  }
}
