import {Component, ElementRef, signal} from '@angular/core';
import {Router, RouterLink} from '@angular/router';
import {FormsModule} from '@angular/forms';
import {Loader} from '../../shared/loader/loader';
import {animate} from 'motion';
import {DonateFlowService} from '../../core/services/donate-flow-service';

type FlowMode = 'choice' | 'anonymous' | 'login' | 'confirm';

@Component({
  selector: 'app-signup-page',
  imports: [
    FormsModule,
    Loader,
    RouterLink
  ],
  templateUrl: './signup-page.html',
  styleUrl: './signup-page.css',
})
export class SignupPage {
  firstName = signal('');
  lastName = signal('');
  email = signal('');
  password = signal('');
  passwordConfirm = signal('');

  error = signal('');
  isSubmitting = signal(false);
  isLoggedIn = signal<boolean>(false);
  mode = signal<FlowMode>('choice');

  constructor(private router: Router, private donateFlow: DonateFlowService,  private el: ElementRef) {}

  submit(): void {
    this.error.set('');

    if (!this.firstName() || !this.lastName() || !this.email() || !this.password()) {
      this.error.set('Veuillez renseigner tous les champs obligatoires.');
      return;
    }
    if (this.password().length < 8) {
      this.error.set('Le mot de passe doit contenir au moins 8 caractères.');
      return;
    }
    if (this.password() !== this.passwordConfirm()) {
      this.error.set('Les mots de passe ne correspondent pas.');
      return;
    }

    this.isSubmitting.set(true);

    // TODO: replace with the real account-creation API call.
    setTimeout(() => {
      this.isSubmitting.set(false);
      this.router.navigate(['/donner'], { queryParams: { mode: 'anonymous' } });
    }, 1000);
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
