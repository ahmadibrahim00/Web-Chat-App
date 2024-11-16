import { TestBed } from '@angular/core/testing';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { AuthenticationService } from './authentication.service';
import { provideHttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment.development';

describe('AuthenticationService', () => {
  let service: AuthenticationService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    httpTestingController = TestBed.inject(HttpTestingController);
    service = TestBed.inject(AuthenticationService);

    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call post on the backend api when logging in', async () => {
    const userCredentials = {
      username: 'username',
      password: 'pwd',
    };
    const mockResponse = { username: 'username' };
    const setItemSpy = spyOn(localStorage, 'setItem').and.callThrough();

    const logoutPromise = service.login(userCredentials);

    const req = httpTestingController.expectOne(
      `${environment.backendURL}${AuthenticationService.LOGIN_PATH}`
    );
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(userCredentials);

    // Mock the response
    req.flush(mockResponse);
    // Wait for the login function to complete
    await logoutPromise;

    // Verify localStorage was updated
    expect(setItemSpy).toHaveBeenCalledWith(
      AuthenticationService.KEY,
      'username'
    );
    // Verify the signal value
    expect(service['username']()).toBe('username');
    // Verify connected
    expect(service.isConnected()).toBe('username');
  });

  it('should call post on the backend api when logging out', async () => {
    const removeItemSpy = spyOn(localStorage, 'removeItem').and.callThrough();

    const logoutPromise = service.logout();

    const req = httpTestingController.expectOne(
      `${environment.backendURL}${AuthenticationService.LOGOUT_PATH}`
    );
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toBeNull();

    // Mock the response
    req.flush({});
    // Wait for the logout function to complete
    await logoutPromise;

    // Verify localStorage was updated
    expect(removeItemSpy).toHaveBeenCalledWith(AuthenticationService.KEY);
    // Verify the signal value
    expect(service['username']()).toBeNull();
    // Verify not connected
    expect(service.isConnected()).toBeNull();
  });
});
