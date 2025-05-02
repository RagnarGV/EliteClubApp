import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PreRegTOCPage } from './pre-reg-toc.page';

describe('PreRegTOCPage', () => {
  let component: PreRegTOCPage;
  let fixture: ComponentFixture<PreRegTOCPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PreRegTOCPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
