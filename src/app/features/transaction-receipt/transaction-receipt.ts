import {Component, OnInit, signal} from '@angular/core';
import {Intent} from '../../core/dtos/intent';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {PaymentService} from '../../services/payment-service';
import {ResponseWrapper} from '../../core/dtos/response-wrapper';
import {Session} from '../../core/dtos/session';
import {AlertService} from '../../core/services/alert-service';
import {DatePipe, DecimalPipe, NgIf} from '@angular/common';
import {Loader} from '../../shared/loader/loader';

type ReceiptState = 'loading' | 'success' | 'failed' | 'error';

@Component({
  selector: 'app-transaction-receipt',
  imports: [
    RouterLink,
    DatePipe,
    DecimalPipe,
    Loader,
  ],
  templateUrl: './transaction-receipt.html',
  styleUrl: './transaction-receipt.css',
  standalone: true
})
export class TransactionReceipt implements OnInit{

  isLoading: boolean = false;

  session = signal<Session | null >(null);
  paymentIntent = signal<Intent | null>(null);


  state = signal<ReceiptState | null>('loading');

  constructor(private readonly route: ActivatedRoute,
              private readonly alert: AlertService,
              private readonly paymentService: PaymentService
  ) {}

  ngOnInit(): void {
    this.isLoading = true
    this.route.queryParams.subscribe(params => {
      const sessionId = params['session_id'];

      if(!sessionId){
        this.state.set('error');
        return;
      }

      this.state.set('loading');



      this.paymentService.verifyPayment(sessionId).subscribe({
        next: (res: ResponseWrapper<Session>) => {
          this.session.set(res.data);
          this.paymentIntent.set((res.data as any) ?.payment_intent ?? null);

          this.state.set(res.data?.payment_status === 'paid' ? 'success' : 'failed' );
        },
        error: () => {
          this.state.set('error');
          this.alert.error('Error retrieving payment session');
        }
      })
    });
  }

  get amountInEuro(): number{
    return (this.session()?.amount_total ?? 0) / 100;
  }

  get createdDate(): number | null {
    const createdAt = this.session()?.createdAt;
    return createdAt ? new Date(createdAt).getTime() : null;
  }

  get truncatedSessionId(): string {
    return this.session()?.id?.slice(0, 32) ?? '';
  }


}
