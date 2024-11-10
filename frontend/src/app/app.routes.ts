import { Routes } from '@angular/router';
import { LoginPageComponent } from './login/pages/login-page/login-page.component';
import { ChatPageComponent } from './chat/pages/chat-page/chat-page.component';
import { loginPageGuard } from './login/guards/login-page.guard';
import { chatPageGuard } from './login/guards/chat-page.guard';

export const routes: Routes = [
  { path: 'chat', component: ChatPageComponent, canActivate: [chatPageGuard] },
  { path: '**', component: LoginPageComponent, canActivate: [loginPageGuard] },
];
