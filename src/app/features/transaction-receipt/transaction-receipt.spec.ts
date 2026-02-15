import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionReceipt } from './transaction-receipt';

describe('TransactionReceipt', () => {
  let component: TransactionReceipt;
  let fixture: ComponentFixture<TransactionReceipt>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransactionReceipt]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TransactionReceipt);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
