import {AfterViewInit, Component, ElementRef, HostListener, OnDestroy, output} from '@angular/core';
import {Router} from '@angular/router';
import {animate} from 'motion';
import {DonateFlowService} from '../../core/services/donate-flow-service';

@Component({
  selector: 'app-donate-modal',
  imports: [],
  templateUrl: './donate-modal.html',
  styleUrl: './donate-modal.css',
})
export class DonateModal implements AfterViewInit, OnDestroy{

  requestClose(): void {
    const backdrop = this.el.nativeElement.querySelector('.modal-backdrop');
    const card = this.el.nativeElement.querySelector('.modal-card');

    const cardAnim = card
      ? animate(card, { opacity: [1, 0], scale: [1, 0.96], y: [0, 10] }, { duration: 0.2, ease: 'easeIn' })
      : null;
    if (backdrop) {
      animate(backdrop, { opacity: [1, 0] }, { duration: 0.22, ease: 'easeIn' });
    }

    const finish = () => {
      this.donateFlow.close();
      this.closed.emit();
    }
    if (cardAnim && 'finished' in cardAnim) {
      (cardAnim as { finished: Promise<unknown> }).finished.then(finish).catch(finish);
    } else {
      setTimeout(finish, 200);
    }
  }
  closed = output<void>();

  private previouslyFocused: HTMLElement | null = null;

  constructor(private el: ElementRef, private router: Router, private donateFlow: DonateFlowService) {}

  ngAfterViewInit(): void {
    this.previouslyFocused = document.activeElement as HTMLElement;
    document.body.style.overflow = 'hidden';

    const backdrop = this.el.nativeElement.querySelector('.modal-backdrop');
    const card = this.el.nativeElement.querySelector('.modal-card');

    if (backdrop) {
      animate(backdrop, { opacity: [0, 1] }, { duration: 0.25, ease: 'easeOut' });
    }
    if (card) {
      animate(
        card,
        { opacity: [0, 1], scale: [0.94, 1], y: [16, 0] },
        { duration: 0.35, ease: [0.22, 1, 0.36, 1] }
      );
    }

    const firstFocusable = this.el.nativeElement.querySelector('.choice-card, .modal-close');
    firstFocusable?.focus();
  }

  ngOnDestroy(): void {
    document.body.style.overflow = '';
    this.previouslyFocused?.focus?.();
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.requestClose();
  }

  onBackdropClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('modal-backdrop')) {
      this.requestClose();
    }
  }



  chooseAnonymous(): void {
    this.requestClose();
    // Anonymous flow: go straight to the donation page in guest mode.
    this.router.navigate(['/donner'], { queryParams: { mode: 'anonymous' } });
  }

  chooseLogin(): void {
    this.requestClose();
    this.router.navigate(['/connexion']);//, { queryParams: { returnUrl: 'login' } }
  }

  createAccount(): void {
    this.requestClose();
    this.router.navigate(['/inscription']);
  }
}
