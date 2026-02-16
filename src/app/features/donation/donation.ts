import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import { NgIf} from '@angular/common';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {MyStripeService} from './service/my-stripe-service';
import {AlertService} from '../../core/services/alert-service';
import {Dialog} from 'primeng/dialog';
import {PaymentService} from '../../services/payment-service';
import {CheckoutSessionRequest} from '../../core/dtos/checkout-session-request';
import {GoogleMapsLoaderService} from '../../core/services/google-maps-loader-service';
import {DatePicker} from 'primeng/datepicker';
import {minMaxDateValidator} from '../../shared/validator/min-max-date.validator';
import {AutoFocus} from 'primeng/autofocus';
import {ResponseWrapper} from '../../core/dtos/response-wrapper';
import {CheckoutSessionResponse} from '../../core/dtos/checkout-session-response';
import {Loader} from '../../shared/loader/loader';


declare const google: any;

@Component({
  selector: 'app-donation',
  imports: [
    NgIf,
    ReactiveFormsModule,
    Dialog,
    FormsModule,
    DatePicker,
    AutoFocus,
    Loader,
  ],
  templateUrl: './donation.html',
  styleUrl: './donation.css',
  standalone: true
})
export class Donation implements OnInit{

  infoForm!: FormGroup;
  paymentMethod: PaymentMethod = 'STRIPE_CHECKOUT';

  selectedPanel: 'support' | 'facture' | 'update' | 'stripe' | null = null;
  showStripeDialog = false;
  private cardMounted = false;
  isLoading = false;
  minDate!: Date;
  maxDate!: Date;
  reportForm!: FormGroup;

  @ViewChild('cardNumberEl') cardNumberEl!: ElementRef;
  @ViewChild('cardExpiryEl') cardExpiryEl!: ElementRef;
  @ViewChild('cardCvcEl') cardCvcEl!: ElementRef;


  constructor(private readonly fb: FormBuilder,
              private readonly stripeService: MyStripeService,
              private readonly paymentService: PaymentService,
              private readonly alert: AlertService,
              private readonly googleMapsLoader: GoogleMapsLoaderService
  ) {
    this.infoForm = this.fb.group({
      amount: ['', [Validators.required, Validators.min(1), Validators.pattern(/^[0-9]+$/)]],
      reason: ['', Validators.required],
      firstname: ['', [Validators.required, Validators.minLength(2), Validators.pattern(/^[A-Za-zÀ-ÖØ-öø-ÿ\s'-]+$/)]],
      lastname: ['', [Validators.required, Validators.minLength(2), Validators.pattern(/^[A-Za-zÀ-ÖØ-öø-ÿ\s'-]+$/)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9]{8,15}$/)]], // Selon pays
      address: ['', [Validators.required]]
    });

    this.reportForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      minDate:['', [Validators.required]],
      maxDate:['', [Validators.required]],
    },
      { validators: minMaxDateValidator})
  }


  @ViewChild('addressInput')
  set address(el: ElementRef<HTMLInputElement> | undefined) {
    if (!el) return;

    this.googleMapsLoader.load().then(() => {
      const autocomplete = new google.maps.places.Autocomplete(
        el.nativeElement,
        {
          types: ['address'],
          componentRestrictions: {country: 'fr'},
          fields: ['formatted_address', 'address_components', 'geometry']
        });

      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        if (!place?.formatted_address) return;

        this.infoForm.patchValue({address: place.formatted_address});

      });
    });
  }

  selectPaymentMethod(method: PaymentMethod) {
    this.paymentMethod = method;
  }


  openPanel(type: 'support' | 'facture' | 'update') {
    this.selectedPanel = type;
  }

  closePanel() {
    this.selectedPanel = null;
  }



  /**
   * Called by p-dialog (onShow)
   */

  onStripeDialogOpen() {

    if (this.cardMounted) return;

    this.isLoading = true;

      this.stripeService.init$().subscribe(() => {
        this.stripeService.mountAll(
          this.cardNumberEl.nativeElement,
          this.cardExpiryEl.nativeElement,
          this.cardCvcEl.nativeElement
        );
        this.cardMounted = true;
        this.isLoading = false
      });
  }

  /**
   * Called by p-dialog (onHide)
   */


  onStripeDialogHide() {
    //this.stripeService.unmountAll();
  }



  submit() {


    if(!this.paymentMethod){
      this.alert.warn("Merci de selection un mode de paiement")
      return;
    }

    if (this.infoForm.invalid) {
      this.infoForm.markAllAsTouched();
      return;
    }
    this.isLoading = true;
    (document.activeElement as HTMLElement)?.blur();
    if(this.paymentMethod === 'STRIPE_CHECKOUT'){
      this.redirectToCheckout();
      return;
    }
    if(this.paymentMethod === 'CARD_DIRECT'){
      this.cardMounted = false;
      this.showStripeDialog = true;
      this.isLoading = false;
    }

  }
  redirectToCheckout() {
    this.isLoading = true;

    const payload: CheckoutSessionRequest = {
      amount: this.infoForm.value.amount * 100,
      currency: 'eur',
      reason: this.infoForm.value.reason,
      billingDetails: {
        firstname: this.infoForm.value.firstname,
        lastname: this.infoForm.value.lastname,
        email: this.infoForm.value.email,
        phone: this.infoForm.value.phone,
        address: this.googleMapsLoader.parseAddress(this.infoForm.value.address)
      },
      idempotencyKey: crypto.randomUUID()
    };

    this.paymentService.createCheckoutSession(payload)
      .subscribe({
        next: ( res: ResponseWrapper<CheckoutSessionResponse>) => {

          globalThis.location.href = res.data.url; // Redirect to stripe
        },
        error: () => {
          this.isLoading = false;
          this.alert.error('Erreur lors de la redirection Stripe');
        }
      });

  }


  payDirect() {
    if (this.isLoading) return;
    this.isLoading = true;

    const amount = this.infoForm.value.amount * 100;
    const addressParsed = this.googleMapsLoader.parseAddress(this.infoForm.value.address)

    const payload: CheckoutSessionRequest = {
      clientSecret: undefined,
      amount: amount,
      currency: 'eur',
      reason: this.infoForm.value.reason,
      billingDetails: {
        firstname: this.infoForm.value.firstname,
        lastname: this.infoForm.value.lastname,
        email: this.infoForm.value.email,
        phone: this.infoForm.value.phone,
        address: addressParsed
      },
      idempotencyKey: crypto.randomUUID()
    };

    console.log("payDirect: {}", payload)

    // Sending backend
    this.paymentService.createPaymentIntent(payload)
      .subscribe({
        next: (res:ResponseWrapper<CheckoutSessionRequest>) => {

          payload.clientSecret = res.data.clientSecret;

          // Stripe Confirmation
          this.stripeService.confirmPayment$(payload)
            .subscribe(result => {
              this.isLoading = false;

            });
        },
        error: err => {
          this.isLoading = false;
          console.error(err);
          this.alert.error('Erreur lors du paiement');
        }
      });
  }


  private resetForm() {
    this.infoForm.reset()
  }

  submitReportForm() {

  }

  ngOnInit(): void {
    this.setYearLimits();
  }

  setYearLimits(){

    const today = new Date();
    const year = today.getFullYear();

    this.minDate = new Date(year,0,1);
    this.maxDate = today

  }

}
