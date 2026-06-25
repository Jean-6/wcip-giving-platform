import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component, computed,
  ElementRef, HostListener, OnDestroy, output, signal,
} from '@angular/core';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {animate, TargetAndTransition} from 'motion';
import {FormsModule} from '@angular/forms';
import {StripeService} from 'ngx-stripe';
import {Loader} from '../../shared/loader/loader';
import {DonateFlowService} from '../../core/services/donate-flow-service';

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
export class DonatePage implements AfterViewInit, OnDestroy {
  mode = signal<FlowMode>('choice');

  // Donation form state
  amounts = [20, 50, 100, 250, 500];
  selectedAmount = signal<number | null>(100);
  customAmount = signal<string>('');
  frequency = signal<Frequency>('once');

  designations: Designation[] = [
    { id: 'general', label: 'Fonds général', description: "Soutient l'ensemble des activités de l'église" },
    { id: 'missions', label: 'Missions', description: 'Finance nos missions à l\'international' },
    { id: 'social', label: 'Action sociale', description: 'Aide alimentaire et accompagnement des familles' },
    { id: 'building', label: 'Bâtiment', description: "Entretien et rénovation du lieu de culte" },
  ];
  selectedDesignation = signal<string>('general');

  // Anonymous flow contact (optional, for receipt only)
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
    return this.selectedAmount() ?? 0;
  });

  constructor(
    private el: ElementRef,
    private route: ActivatedRoute,
    private stripe: StripeService,
    private router: Router,
    private donateFlow: DonateFlowService
  ) {}

  ngOnDestroy(): void {
        //throw new Error("Method not implemented.");
    }

  ngAfterViewInit(): void {
        //throw new Error("Method not implemented.");
    }

  ngOnInit(): void {
    const amountParam = this.route.snapshot.queryParamMap.get('amount');
    const parsed = amountParam ? parseInt(amountParam, 10) : null;
    if (parsed && this.amounts.includes(parsed)) {
      this.selectedAmount.set(parsed);
    } else if (parsed && parsed > 0) {
      this.customAmount.set(String(parsed));
      this.selectedAmount.set(null);
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
    this.router.navigate(['/']).then(() => this.donateFlow.isOpen);

    /*this.router.navigate(['/'],{
      relativeTo: this.route,
      queryParams: {mode: null},
      queryParamsHandling: 'merge'
    });*/

    setTimeout(() => {
      this.animateChoiceCards();
    }, 50);

  }

  selectAmount(value: number): void {
    this.selectedAmount.set(value);
    this.customAmount.set('');
  }

  onCustomAmountInput(value: string): void {
    this.customAmount.set(value);
    if (value) this.selectedAmount.set(null);
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

    /*try {
      await this.stripe.redirectToCheckout({
        amount: Math.round(this.finalAmount() * 100), // Stripe expects cents
        mode: this.frequency() === 'monthly' ? 'subscription' : 'payment',
        designation: this.selectedDesignation(),
        email: this.contactEmail() || undefined,
      });
      // On success, the browser navigates away to Stripe — no further
      // local state update is needed here.
    } catch {
      this.isProcessing.set(false);
      this.checkoutError.set(
        "Impossible de démarrer le paiement pour le moment. Veuillez réessayer dans un instant."
      );
    }*/
  }

  get designationLabel(): string {
    return this.designations.find(d => d.id === this.selectedDesignation())?.label ?? '';
  }

  get selectedDesignationDescription(): string {
    return this.designations.find(d => d.id === this.selectedDesignation())?.description ?? '';
  }
}
