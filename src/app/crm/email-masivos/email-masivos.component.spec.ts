import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailMasivosComponent } from './email-masivos.component';

describe('EmailMasivosComponent', () => {
  let component: EmailMasivosComponent;
  let fixture: ComponentFixture<EmailMasivosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmailMasivosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmailMasivosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
