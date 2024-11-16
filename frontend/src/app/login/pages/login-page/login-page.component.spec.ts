import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginPageComponent } from './login-page.component';
import { ReactiveFormsModule } from '@angular/forms';
import { LoginFormComponent } from '../../components/login-form/login-form.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('LoginPageComponent', () => {
  let component: LoginPageComponent;
  let fixture: ComponentFixture<LoginPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        NoopAnimationsModule,
        LoginPageComponent,
        LoginFormComponent,
      ],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
