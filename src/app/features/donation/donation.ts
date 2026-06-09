import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {NgIf, NgSwitch, NgSwitchCase} from '@angular/common';
import {AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {MyStripeService} from './service/my-stripe-service';
import {AlertService} from '../../core/services/alert-service';
import {Dialog} from 'primeng/dialog';
import {PaymentService} from '../../services/payment-service';
import {CheckoutSessionRequest} from '../../core/dtos/checkout-session-request';
import {GoogleMapsLoaderService} from '../../core/services/google-maps-loader-service';
import {AutoFocus} from 'primeng/autofocus';
import {ResponseWrapper} from '../../core/dtos/response-wrapper';
import {CheckoutSessionResponse} from '../../core/dtos/checkout-session-response';
import {Loader} from '../../shared/loader/loader';
import {UpdatePanel} from '../update-panel/update-panel';
import {SupportPanel} from '../support-panel/support-panel';
import {ReportPanel} from '../report-panel/report-panel';

declare const google: any;

@Component({
  selector: 'app-donation',
  imports: [
    NgIf,
    ReactiveFormsModule,
    Dialog,
    FormsModule,
    AutoFocus,
    Loader,
    UpdatePanel,
    NgSwitch,
    NgSwitchCase,
    SupportPanel,
    ReportPanel,
  ],
  templateUrl: './donation.html',
  styleUrl: './donation.css',
  standalone: true
})
export class Donation implements OnInit, AfterViewInit{

  infoForm!: FormGroup;
  paymentMethod: PaymentMethod = 'STRIPE_CHECKOUT';
  reportForm!: FormGroup;

  selectedPanel: 'support' | 'report' | 'update' | 'stripe' | null = null;
  showStripeDialog = false;
  private cardMounted = false;
  isLoading = false;
  minDate!: Date;
  maxDate!: Date;


  readonly amountPattern = /^[1-9]\d*(?:[.,]\d{1,2})?$/;
  readonly frenchPhonePattern = /^0[1-9]\d{8}$/;

  @ViewChild('cardNumberEl') cardNumberEl!: ElementRef;
  @ViewChild('cardExpiryEl') cardExpiryEl!: ElementRef;
  @ViewChild('cardCvcEl') cardCvcEl!: ElementRef;


  @ViewChild('addressInput') addressInput!: ElementRef;

  ngOnInit(): void {
    this.setYearLimits();
  }

  constructor(private readonly fb: FormBuilder,
              private readonly stripeService: MyStripeService,
              private readonly paymentService: PaymentService,
              private readonly alert: AlertService,
              private readonly googleMapsLoader: GoogleMapsLoaderService
  ) {
    this.infoForm = this.fb.group({
      amount: ['',
        [
          Validators.required,
          Validators.min(1),
          Validators.pattern(this.amountPattern)
        ]
      ],
      reason: ['',
        Validators.required
      ],
      firstname: ['',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.pattern(/^[A-Za-zÀ-ÖØ-öø-ÿ\s'-]+$/)
        ]
      ],
      lastname: ['',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.pattern(/^[A-Za-zÀ-ÖØ-öø-ÿ\s'-]+$/)
        ]
      ],
      email: ['',
        [
          Validators.required,
          Validators.email
        ]
      ],
      phone: ['',
        [
          Validators.required,
          Validators.pattern(this.frenchPhonePattern)
        ]
      ],
      address: ['',
        [
          Validators.required ,this.addressValidator.bind(this)
        ]
      ]
    });
  }

  selectPaymentMethod(method: PaymentMethod) {
    this.paymentMethod = method;
  }


  openPanel(type: 'support' | 'report' | 'update') {
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

    console.log('submit!');

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

  }
  redirectToCheckout() {

    console.log('redirectToCheckout');

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

    console.log("redirect to : " + payload);

    this.paymentService.createCheckoutSession(payload)
      .subscribe({
        next: ( res: ResponseWrapper<CheckoutSessionResponse>) => {
          console.log("Into subscribe : "+ res.data.url);
          globalThis.location.href = res.data.url; // Redirect to stripe
        },
        error: () => {
          this.isLoading = false;
          this.alert.error('Erreur lors de la redirection Stripe');
        }
      });

  }

  private resetForm() {
    this.infoForm.reset()
  }


  setYearLimits(){
    const today = new Date();
    const year = today.getFullYear();
    this.minDate = new Date(year,0,1);
    this.maxDate = today

  }

  ngAfterViewInit(): void {
    this.googleMapsLoader.load().then(() => {
      const autoComplete = new google.maps.places.Autocomplete(
        this.addressInput.nativeElement,
        {
          types: ['address'],
          componentRestrictions: { country: 'fr' }
        } );
      autoComplete.addListener('place_changed', () => {
      const place = autoComplete.getPlace();
      this.onAddressSelected(place);
      });
    });
  }

  onAddressSelected(place: google.maps.places.PlaceResult){
    const control = this.infoForm.get('address');
    if (!place.formatted_address) {
      control?.setErrors({ notGoogleAddress: true });
      return;
    }
    control?.setValue(place.formatted_address);
    control?.setErrors(null);
  }


  addressValidator(control: AbstractControl) {
    if (!control.value) {
      return { required: true };
    }
    return null;
  }

  submitReportForm(){}
}
