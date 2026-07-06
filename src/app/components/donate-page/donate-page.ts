import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component, computed,
  ElementRef, HostListener, OnDestroy, OnInit, output, signal,
} from '@angular/core';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {animate, TargetAndTransition} from 'motion';
import {FormsModule} from '@angular/forms';
import {StripeService} from 'ngx-stripe';
import {Loader} from '../../shared/loader/loader';
import {DonateFlowService} from '../../core/services/donate-flow-service';
import {MyStripeService} from '../../services/my-stripe-service';
import {CheckoutSessionRequest} from '../../core/dtos/checkout-session-request';
import {ResponseWrapper} from '../../core/dtos/response-wrapper';
import {CheckoutSessionResponse} from '../../core/dtos/checkout-session-response';
import {AlertService} from '../../core/services/alert-service';

type MotionOptions = Parameters<typeof animate>[2];
export type MotionOptions1 = TargetAndTransition;
type FlowMode = 'choice' | 'anonymous' | 'login' | 'confirm';
type Frequency = 'once' | 'monthly' ;

interface Designation {
  id: string;
  label: string;
  description: string;
}


@Component({
  selector: 'app-donate-page',
  standalone: true,
  imports: [
    FormsModule,
    Loader,
    RouterLink
  ],
  templateUrl: './donate-page.html',
  styleUrl: './donate-page.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DonatePage implements OnInit,AfterViewInit, OnDestroy {
  mode = signal<FlowMode>('choice');

  customAmount = signal<string>('');
  frequency = signal<Frequency>('once');

  checkoutSessionPayload : CheckoutSessionRequest = {};

  designations: Designation[] = [
    { id: 'general', label: 'Dîme', description: "Soutient l'ensemble des activités de l'église" },
    { id: 'missions', label: 'Offrande', description: 'Finance nos missions à l\'international' },
    { id: 'social', label: 'Don', description: 'Aide alimentaire et accompagnement des familles' },
    { id: 'building', label: 'Sacrifice de Shiloh', description: "Entretien et rénovation du lieu de culte" },
    { id: 'prophetic', label: 'Offrand Prophetique', description: "Entretien et rénovation du lieu de culte" },
  ];
  selectedDesignation = signal<string>('general');


  contactEmail = signal<string>('');
  contactMessage = signal<string>('');

  // Login flow
  loginEmail = signal<string>('');
  loginPassword = signal<string>('');
  loginError = signal<string>('');
  isSubmittingLogin = signal<boolean>(false);

  // Card payment is handled entirely by Stripe Checkout — we never collect
  // card details ourselves. Only an optional error from the redirect call.
  isProcessing = signal<boolean>(false);
  checkoutError = signal<string>('');
  isLoggedIn = signal<boolean>(false);

  finalAmount = computed<number>(() => {
    const custom = parseFloat(this.customAmount());
    if (!isNaN(custom) && custom > 0) return custom;
    return 0;
  });

  constructor(
    private el: ElementRef,
    private route: ActivatedRoute,
    private myStripe: MyStripeService,
    private router: Router,
    private donateFlow: DonateFlowService,
    private alert: AlertService
  ) {}

  ngOnDestroy(): void {}

  ngAfterViewInit(): void {}

  ngOnInit(): void {
    const amountParam = this.route.snapshot.queryParamMap.get('amount');
    const parsed = amountParam ? parseInt(amountParam, 10) : null;
    if (parsed && parsed > 0) {
      this.customAmount.set(String(parsed));
      //this.selectedAmount.set(null);
    }

    // If the user already chose a path from the header modal, skip the
    // choice screen and land directly on the right step.
    const modeParam = this.route.snapshot.queryParamMap.get('mode');
    if (modeParam === 'anonymous') {
      this.mode.set('anonymous');
      this.animatePanelIn('.flow-panel');
    } else if (modeParam === 'login') {
      this.mode.set('login');
      this.animatePanelIn('.flow-panel');
    } else {
      this.animateChoiceCards();
    }
  }

  private animateChoiceCards(): void {
    const cards = this.el.nativeElement.querySelectorAll('.choice-card');
    cards.forEach((card: Element, i: number) => {
      animate(card as HTMLElement, { opacity: [0, 1], y: [24, 0] } as any, {
        duration: 0.5, delay: 0.15 + i * 0.1, ease: [0.22, 1, 0.36, 1]
      });
    });
  }

  private animatePanelIn(selector: string): void {
    // Wait a tick for the new template branch to render before animating.
    setTimeout(() => {
      const panel = this.el.nativeElement.querySelector(selector);
      if (panel) {
        animate(panel, { opacity: [0, 1], y: [16, 0] }, { duration: 0.45, ease: [0.22, 1, 0.36, 1] });
      }
    });
  }

  chooseAnonymous(): void {
    this.mode.set('anonymous');
    this.animatePanelIn('.flow-panel');
  }

  chooseLogin(): void {
    this.mode.set('login');
    this.animatePanelIn('.flow-panel');
  }

  backToChoice(): void {
    this.mode.set('choice');
    this.isLoggedIn.set(false);
    this.router.navigate(['/']).then(() => this.donateFlow.open());
    setTimeout(() => {
      this.animateChoiceCards();
    }, 50);

  }
  onCustomAmountInput(value: string): void {
    this.customAmount.set(value);
  }

  selectDesignation(id: string): void {
    this.selectedDesignation.set(id);
  }

  setFrequency(f: Frequency): void {
    this.frequency.set(f);
  }

  submitLogin(): void {
    this.loginError.set('');
    if (!this.loginEmail() || !this.loginPassword()) {
      this.loginError.set('Veuillez renseigner votre email et votre mot de passe.');
      return;
    }
    this.isSubmittingLogin.set(true);
    // Simulated auth — in production this calls the real identity provider.
    setTimeout(() => {
      this.isSubmittingLogin.set(false);
      this.isLoggedIn.set(true);
      this.mode.set('anonymous'); // reuse the same donation form once "connected"
      this.animatePanelIn('.flow-panel');
    }, 900);
  }

  continueAsGuestFromLogin(): void {
    this.mode.set('anonymous');
    this.animatePanelIn('.flow-panel');
  }

  async confirmDonation(): Promise<void> {
    if (this.finalAmount() <= 0 || this.isProcessing()) return;

    this.checkoutError.set('');
    this.isProcessing.set(true);

    this.checkoutSessionPayload = {
      amount: parseFloat(this.customAmount()) * 100,
      currency: 'eur',
      reason: this.contactMessage(),
      idempotencyKey: this.generateUUID,
      //cancelUrl: `${window.location.origin}/donner?mode=anonymous&amount=${parseFloat(this.customAmount()) * 100}`,

    }

    try {
      this.myStripe.createCheckoutSession(this.checkoutSessionPayload)
        .subscribe({
          next: (session: ResponseWrapper<CheckoutSessionResponse>) => {
            globalThis.location.href = session.data.url; // Redirect to stripe
          },
          error: (e) => {
            this.isProcessing.set(false) ;
            this.alert.error('Erreur lors de la redirection Stripe');
            console.error(e);
          }
        })
    } catch {
      this.isProcessing.set(false);
      this.checkoutError.set(
        "Impossible de démarrer le paiement pour le moment. Veuillez réessayer dans un instant."
      );
    }
  }

  get generateUUID(): string {
    // Check if the native browser crypto and randomUUID are available
    if (typeof window !== 'undefined' && window.crypto && typeof window.crypto.randomUUID === 'function') {
      return window.crypto.randomUUID();
    }
    // Fallback math-based UUIDv4 generator (if context is not secure)
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }

  get designationLabel(): string {
    return this.designations.find(d => d.id === this.selectedDesignation())?.label ?? '';
  }

  get selectedDesignationDescription(): string {
    return this.designations.find(d => d.id === this.selectedDesignation())?.description ?? '';
  }
}
