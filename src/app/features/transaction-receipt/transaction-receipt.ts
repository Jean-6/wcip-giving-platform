import {Component, OnInit} from '@angular/core';
import {Intent} from '../../core/dtos/intent';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {PaymentService} from '../../services/payment-service';
import {ResponseWrapper} from '../../core/dtos/response-wrapper';
import {Session} from '../../core/dtos/session';
import {AlertService} from '../../core/services/alert-service';
import {DatePipe, DecimalPipe, NgIf} from '@angular/common';

@Component({
  selector: 'app-transaction-receipt',
  imports: [
    RouterLink,
    DatePipe,
    DecimalPipe,
    NgIf,
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

    this.route.queryParams.subscribe(params => {
      const sessionId = params['session_id'];
      console.log("session id: {}",sessionId)
      this.paymentService.getSession(sessionId).subscribe({
        next: (res: ResponseWrapper<Session>) =>{
          console.log("res data: {}",res.data)
          this.session = res.data;
          this.isLoading =true;
        },
        error: () =>{
          this.isLoading = false;
          this.alert.error('Erreur lors du chargement de session');
        }
      });
    });
  }

  get amountInEuro(): number{
    return (this.paymentIntent?.amount ?? 0) / 100;
  }

  get createdDate(): number | null {
    return this.paymentIntent?.created
      ? this.paymentIntent.created * 1000
      : null;
  }


}
