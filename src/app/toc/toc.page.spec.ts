import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TocPage } from './toc.page';

describe('TocPage', () => {
  let component: TocPage;
  let fixture: ComponentFixture<TocPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(TocPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
