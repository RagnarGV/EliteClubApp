import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FANDQPage } from './fandq.page';

describe('FANDQPage', () => {
  let component: FANDQPage;
  let fixture: ComponentFixture<FANDQPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(FANDQPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
