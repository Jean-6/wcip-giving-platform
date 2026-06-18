import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DonateModal } from './donate-modal';

describe('DonateModal', () => {
  let component: DonateModal;
  let fixture: ComponentFixture<DonateModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DonateModal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DonateModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
