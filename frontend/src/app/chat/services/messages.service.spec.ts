import { TestBed } from '@angular/core/testing';

import { MessagesService } from './messages.service';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('MessagesService', () => {
  let service: MessagesService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(MessagesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
