import {Component, ElementRef, signal} from '@angular/core';
import {Router, RouterLink} from '@angular/router';
import {FormGroup, FormsModule} from '@angular/forms';
import {Loader} from '../../shared/loader/loader';
import {animate} from 'motion';
import {DonateFlowService} from '../../core/services/donate-flow-service';
import {RegisterRequest} from '../../core/dtos/register-request';
import {AuthService} from '../../services/auth-service';
import {ResponseWrapper} from '../../core/dtos/response-wrapper';
import {RegisterResponse} from '../../core/dtos/register-response';
import {AlertService} from '../../core/services/alert-service';

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


  registerRequestPayload : RegisterRequest = {};

  firstName = signal('');
  lastName = signal('');
  email = signal('');
  username = signal('');
  password = signal('');
  passwordConfirm = signal('');

  error = signal('');
  isSubmitting = signal(false);
  isLoggedIn = signal<boolean>(false);
  mode = signal<FlowMode>('choice');

  constructor(private router: Router, private donateFlow: DonateFlowService,  private el: ElementRef, private authService: AuthService, private alert: AlertService) {}

  submit(): void {
    this.error.set('');

    if (!this.firstName() || !this.lastName() || !this.username()  || !this.email() || !this.password()) {
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

    this.registerRequestPayload ={
      firstname: this.firstName(),
      lastname: this.lastName(),
      email: this.email(),
      username: this.username(),
      password: this.password(),
    }

      this.authService.registration(this.registerRequestPayload)
        .subscribe({
          next: (result: ResponseWrapper<RegisterResponse> ) => {
            console.log("2. Réponse de l'API reçue avec succès !", result);
            this.isSubmitting.set(false);
            this.alert.success('Inscription réussie !');


            if(result.data && result.data.accessToken){
              this.authService.login(result.data.accessToken);
            }

            this.router.navigate(['/dashboard']);

          },
          error: (error) => {
            this.isSubmitting.set(false);
            const errorMsg = error.msg || "Une erreur est survenue.";
            this.error.set(errorMsg);
            this.alert.error(errorMsg);
            console.log(error);
          }
        });
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
