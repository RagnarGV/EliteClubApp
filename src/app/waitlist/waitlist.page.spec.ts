import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WaitlistPage } from './waitlist.page';

describe('WaitlistPage', () => {
  let component: WaitlistPage;
  let fixture: ComponentFixture<WaitlistPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(WaitlistPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
