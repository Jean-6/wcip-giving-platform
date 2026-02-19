import {Component, OnInit} from '@angular/core';
import {Intent} from '../../core/dtos/intent';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {PaymentService} from '../../services/payment-service';
import {ResponseWrapper} from '../../core/dtos/response-wrapper';
import {Session} from '../../core/dtos/session';
import {AlertService} from '../../core/services/alert-service';
import {DatePipe, DecimalPipe, NgIf} from '@angular/common';
import {Loader} from '../../shared/loader/loader';

@Component({
  selector: 'app-transaction-receipt',
  imports: [
    RouterLink,
    DatePipe,
    DecimalPipe,
    NgIf,
    Loader,
  ],
  templateUrl: './transaction-receipt.html',
  styleUrl: './transaction-receipt.css',
  standalone: true
})
export class TransactionReceipt implements OnInit{

  session: any;
  isLoading: boolean = false;
  paymentIntent: Intent | null = null;

  constructor(private readonly route: ActivatedRoute,
              private readonly alert: AlertService,
              private readonly paymentService: PaymentService
  ) {}

  ngOnInit(): void {

    this.isLoading = true
    this.route.queryParams.subscribe(params => {
      const sessionId = params['session_id'];
      this.paymentService.getSession(sessionId).subscribe({
        next: (res: ResponseWrapper<Session>) =>{
          this.session = res.data;
          console.log(this.session)
          this.isLoading =false;
        },
        error: () =>{
          this.isLoading = true;
          this.alert.error('Erreur lors du chargement de session');
        }
      });
    });
  }

  get amountInEuro(): number{
    return (this.session?.amountTotal ?? 0) / 100;
  }

  get createdDate(): number | null {
    return this.session?.createdAt
      ? new Date(this.session.createdAt).getTime()
      : null;
  }
}
