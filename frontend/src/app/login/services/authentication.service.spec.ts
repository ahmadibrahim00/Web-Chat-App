import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { AuthenticationService } from './authentication.service';
import { environment } from 'src/environments/environment.development';
import { provideHttpClient } from '@angular/common/http';

describe('AuthenticationService', () => {
  let service: AuthenticationService;
  let httpTestingController: HttpTestingController;

  const loginData = {
    username: 'username',
    password: 'pwd',
  };

  afterEach(() => {
    localStorage.clear();
  });

  describe('on login', () => {
    beforeEach(() => {
      localStorage.clear();
      TestBed.configureTestingModule({
        providers: [provideHttpClient(), provideHttpClientTesting()],
      });
      httpTestingController = TestBed.inject(HttpTestingController);
      service = TestBed.inject(AuthenticationService);
    });

    it('should call POST with login data to auth/login', async () => {
      const loginPromise = service.login(loginData);

      const req = httpTestingController.expectOne(
        `${environment.backendURL}/auth/login`
      );
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(loginData);
      req.flush({ username: loginData.username });

      // wait for the login to complete
      await loginPromise;
    });

    it('should store and emit the username', async () => {
      const mockResponse = { username: 'username' };
      const setItemSpy = spyOn(localStorage, 'setItem').and.callThrough();

      const loginPromise = service.login(loginData);

      const req = httpTestingController.expectOne(
        `${environment.backendURL}${AuthenticationService.LOGIN_PATH}`
      );

      req.flush(mockResponse);
      await loginPromise;

      expect(setItemSpy).toHaveBeenCalledWith(
        AuthenticationService.KEY,
        'username'
      );
      expect(service['username']()).toBe('username');
    });
  });

  describe('on logout', () => {
    beforeEach(() => {
      localStorage.setItem('username', loginData.username);

      TestBed.configureTestingModule({
        providers: [provideHttpClient(), provideHttpClientTesting()],
      });
      httpTestingController = TestBed.inject(HttpTestingController);
      service = TestBed.inject(AuthenticationService);
    });

    it('should call POST to auth/logout', async () => {
      const logoutPromise = service.logout();

      const req = httpTestingController.expectOne(
        `${environment.backendURL}${AuthenticationService.LOGOUT_PATH}`
      );
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toBeNull();

      req.flush({});
      await logoutPromise;
    });

    it('should remove the username from the service and local storage', async () => {
      const removeItemSpy = spyOn(localStorage, 'removeItem').and.callThrough();

      const logoutPromise = service.logout();

      const req = httpTestingController.expectOne(
        `${environment.backendURL}${AuthenticationService.LOGOUT_PATH}`
      );

      req.flush({});
      await logoutPromise;

      expect(removeItemSpy).toHaveBeenCalledWith(AuthenticationService.KEY);
      expect(service['username']()).toBeNull();
    });
  });
});
