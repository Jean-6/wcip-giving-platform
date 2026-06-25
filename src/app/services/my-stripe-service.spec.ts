import { MyStripeService } from './my-stripe-service';
import {TestBed} from '@angular/core/testing';

describe('MyStripeService', () => {
  let service: MyStripeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MyStripeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
