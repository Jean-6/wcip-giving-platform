import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupportPanel } from './support-panel';

describe('SupportPanel', () => {
  let component: SupportPanel;
  let fixture: ComponentFixture<SupportPanel>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SupportPanel]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SupportPanel);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
