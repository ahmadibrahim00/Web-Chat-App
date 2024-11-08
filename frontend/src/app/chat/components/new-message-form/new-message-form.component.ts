import { Component, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormField } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-new-message-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormField,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './new-message-form.component.html',
  styleUrl: './new-message-form.component.css',
})
export class NewMessageFormComponent {
  messageForm = this.fb.group({
    msg: '',
  });

  file: File | null = null;
  publishMessage = output<{ msg: string; file: File | null }>();

  constructor(private fb: FormBuilder) {}

  get hasImage() {
    return this.file != null;
  }

  onPublishMessage() {
    const msg = this.messageForm.value.msg?.trim();
    if (msg) {
      this.publishMessage.emit({ msg, file: this.file });
      this.messageForm.reset();
      this.file = null;
    }
  }

  fileChanged(event: Event) {
    const input = event.target as HTMLInputElement;
    this.file = input.files ? input.files[0] : null;
  }
}
