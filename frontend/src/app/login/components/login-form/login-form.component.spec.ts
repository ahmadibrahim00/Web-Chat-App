import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';

import { LoginFormComponent } from './login-form.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TestHelper } from 'src/app/tests/test-helper';

describe('LoginFormComponent', () => {
  let component: LoginFormComponent;
  let fixture: ComponentFixture<LoginFormComponent>;
  let testHelper: TestHelper<LoginFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, LoginFormComponent, NoopAnimationsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginFormComponent);
    component = fixture.componentInstance;
    testHelper = new TestHelper(fixture);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit username and password', () => {
    let username: string;
    let password: string;

    // On s'abonne à l'EventEmitter pour recevoir les valeurs émises.
    component.login.subscribe((event) => {
      username = event.username;
      password = event.password;
    });

    const usernameInput = testHelper.getInput('username-input');
    testHelper.writeInInput(usernameInput, 'username');
    const passwordInput = testHelper.getInput('password-input');
    testHelper.writeInInput(passwordInput, 'pwd');

    fixture.detectChanges();

    const button = testHelper.getButton('submit-button');
    button.click();

    expect(username!).toBe('username');
    expect(password!).toBe('pwd');
    expect(component.loginForm.valid).toBe(true);
  });

  it('should not allow empty username', () => {
    let username: string;
    let password: string;

    // On s'abonne à l'EventEmitter pour recevoir les valeurs émises.
    component.login.subscribe((event) => {
      username = event.username;
      password = event.password;
    });

    const passwordInput = testHelper.getInput('password-input');
    testHelper.writeInInput(passwordInput, 'pwd');

    fixture.detectChanges();

    const button = testHelper.getButton('submit-button');
    button.click();

    fixture.detectChanges();

    const usernameError = testHelper
      .getElement('username-error')
      .textContent?.trim();

    expect(username!).toBeUndefined();
    expect(password!).toBeUndefined();
    expect(usernameError).toEqual("Nom d'utilisateur requis.");
    expect(component.loginForm.valid).toBe(false);
  });

  it('should not allow empty password', () => {
    let username: string;
    let password: string;

    // On s'abonne à l'EventEmitter pour recevoir les valeurs émises.
    component.login.subscribe((event) => {
      username = event.username;
      password = event.password;
    });

    const usernameInput = testHelper.getInput('username-input');
    testHelper.writeInInput(usernameInput, 'username');

    fixture.detectChanges();

    const button = testHelper.getButton('submit-button');
    button.click();

    fixture.detectChanges();

    const passwordError = testHelper
      .getElement('password-error')
      .textContent?.trim();

    expect(username!).toBeUndefined();
    expect(password!).toBeUndefined();
    expect(passwordError).toEqual('Mot de passe requis.');
    expect(component.loginForm.valid).toBe(false);
  });

  it('should not allow empty username and password', () => {
    let username: string;
    let password: string;

    // On s'abonne à l'EventEmitter pour recevoir les valeurs émises.
    component.login.subscribe((event) => {
      username = event.username;
      password = event.password;
    });

    fixture.detectChanges();

    const button = testHelper.getButton('submit-button');
    button.click();

    fixture.detectChanges();

    const usernameError = testHelper
      .getElement('username-error')
      .textContent?.trim();
    const passwordError = testHelper
      .getElement('password-error')
      .textContent?.trim();

    expect(username!).toBeUndefined();
    expect(password!).toBeUndefined();
    expect(usernameError).toEqual("Nom d'utilisateur requis.");
    expect(passwordError).toEqual('Mot de passe requis.');
    expect(component.loginForm.valid).toBe(false);
  });
});
