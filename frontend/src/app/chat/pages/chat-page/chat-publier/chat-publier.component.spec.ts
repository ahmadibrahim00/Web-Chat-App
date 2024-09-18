import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatPublierComponent } from './chat-publier.component';

describe('ChatPublierComponent', () => {
  let component: ChatPublierComponent;
  let fixture: ComponentFixture<ChatPublierComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChatPublierComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChatPublierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
