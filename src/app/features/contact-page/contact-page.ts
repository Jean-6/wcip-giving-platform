import { Component, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import {Loader} from '../../shared/loader/loader';


@Component({
  selector: 'app-contact-page',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, Loader],
  templateUrl: './contact-page.html',
  styleUrls: ['./contact-page.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactPage {
  // Form state
  firstName = signal<string>('');
  lastName = signal<string>('');
  email = signal<string>('');
  gender = signal<string>('');
  country = signal<string>('');
  city = signal<string>('');
  subject = signal<string>('');
  message = signal<string>('');

  // UI state
  isSubmitting = signal<boolean>(false);
  error = signal<string>('');
  success = signal<boolean>(false);

  submit(): void {
    this.error.set('');
    this.success.set(false);

    if (!this.firstName() || !this.lastName() || !this.email() || !this.message()) {
      this.error.set('Veuillez remplir tous les champs obligatoires (Nom, Prénom, Email, Message).');
      return;
    }
    if (!this.isValidEmail(this.email())) {
      this.error.set('Veuillez saisir une adresse email valide.');
      return;
    }

    this.isSubmitting.set(true);

    // TODO: replace with the real contact-form API call.
    setTimeout(() => {
      this.isSubmitting.set(false);
      this.success.set(true);
      this.resetForm();
    }, 1200);
  }

  private isValidEmail(value: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  private resetForm(): void {
    this.firstName.set('');
    this.lastName.set('');
    this.email.set('');
    this.gender.set('');
    this.country.set('');
    this.city.set('');
    this.subject.set('');
    this.message.set('');
  }
}
