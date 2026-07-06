import {Component, ElementRef, OnInit, signal} from '@angular/core';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {Loader} from '../../shared/loader/loader';
import {FormsModule} from '@angular/forms';
import {animate} from 'motion';
import {DonateFlowService} from '../../core/services/donate-flow-service';
import {AlertService} from '../../core/services/alert-service';


type FlowMode = 'choice' | 'anonymous' | 'login' | 'confirm';
@Component({
  selector: 'app-login-page',
  imports: [
    Loader,
    RouterLink,
    FormsModule
  ],
  templateUrl: './login-page.html',
  styleUrl: './login-page.css',
})
export class LoginPage implements OnInit {

  mode = signal<FlowMode>('choice');

  email = signal('');
  password = signal('');
  error = signal('');
  isSubmitting = signal(false);
  isLoggedIn = signal<boolean>(false);

  /** Where to send the user after a successful login (e.g. back to the donation flow). */
  private redirectTo = '/donner';
  private redirectQueryParams: Record<string, string> = { mode: 'anonymous' };

  constructor(private router: Router, private route: ActivatedRoute,private donateFlow: DonateFlowService,  private el: ElementRef, private alert: AlertService) {
    const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl');
    if (returnUrl) this.redirectTo = returnUrl;
  }

  ngOnInit(): void {
    //this.alertService.
        //this.isSubmitting = signal(true);
    }

  submit(): void {
    this.error.set('');
    if (!this.email() || !this.password()) {
      this.error.set('Veuillez renseigner votre email et votre mot de passe.');
      return;
    }

    this.isSubmitting.set(true);

    // TODO: replace with the real authentication API call.
    setTimeout(() => {
      this.isSubmitting.set(false);
      this.router.navigate([this.redirectTo], { queryParams: this.redirectQueryParams });
    }, 900);
  }

  backToChoice(): void {
    this.mode.set('choice');
    this.isLoggedIn.set(false);
    this.router.navigate(['/']).then(() => this.donateFlow.open());
    setTimeout(() => {
      this.animateChoiceCards();
    }, 50);

  }

  private animateChoiceCards(): void {
    const cards = this.el.nativeElement.querySelectorAll('.choice-card');
    cards.forEach((card: Element, i: number) => {
      animate(card as HTMLElement, { opacity: [0, 1], y: [24, 0] } as any, {
        duration: 0.5, delay: 0.15 + i * 0.1, ease: [0.22, 1, 0.36, 1]
      });
    });
  }
}
