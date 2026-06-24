import {Component, signal} from '@angular/core';
import {Router, RouterLink} from '@angular/router';
import {FormsModule} from '@angular/forms';
import {Loader} from '../../shared/loader/loader';

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

  constructor(private router: Router) {}

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
}
