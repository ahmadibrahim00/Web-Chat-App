import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatAffichageComponent } from './chat-affichage.component';

describe('ChatAffichageComponent', () => {
  let component: ChatAffichageComponent;
  let fixture: ComponentFixture<ChatAffichageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChatAffichageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChatAffichageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
