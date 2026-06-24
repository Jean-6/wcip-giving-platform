import {Component, OnInit, signal} from '@angular/core';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {Loader} from '../../shared/loader/loader';
import {FormsModule} from '@angular/forms';

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
  email = signal('');
  password = signal('');
  error = signal('');
  isSubmitting = signal(false);

  /** Where to send the user after a successful login (e.g. back to the donation flow). */
  private redirectTo = '/donner';
  private redirectQueryParams: Record<string, string> = { mode: 'anonymous' };

  constructor(private router: Router, private route: ActivatedRoute) {
    const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl');
    if (returnUrl) this.redirectTo = returnUrl;
  }

  ngOnInit(): void {
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
}
