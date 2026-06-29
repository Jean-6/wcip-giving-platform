import {Component, ElementRef, OnInit, signal} from '@angular/core';
import { animate} from 'motion';
import {RouterLink, RouterLinkActive} from '@angular/router';
import {DonateModal} from '../donate-modal/donate-modal';
import {DonateFlowService} from '../../core/services/donate-flow-service';

type MotionOptions = Parameters<typeof animate>[2];
@Component({
  selector: 'app-header',
  imports: [
    RouterLink,
    DonateModal,
    RouterLinkActive,
  ],
  templateUrl: './header.html',
  styleUrl: './header.css',
})

export class Header implements  OnInit {

  mobileMenuOpen = signal(false);
  donateModalOpen = signal(false);

  animOptions1: MotionOptions = {
    duration: 0.6,
    ease: 'easeOut',
  };

  animOptions2: MotionOptions = {
    duration: 0.5,
    delay: 0.15,
    ease: 'easeOut'
  };


  navLinks = [
    { label: 'Accueil', href: '/'},
    { label: 'Ressources', href: 'resource' },
    { label: 'Evenements', href: 'event' },
    { label: 'Boutique', href: 'shop'},
    { label: 'Contact', href: 'contact' },
  ];

  socialLinks = [
    { icon: 'fab fa-facebook-f', href: '#', label: 'Facebook' },
    { icon: 'fab fa-youtube', href: '#', label: 'YouTube' },
    { icon: 'fab fa-instagram', href: '#', label: 'Instagram' },
    { icon: 'fab fa-twitter', href: '#', label: 'Twitter' },
  ];

  constructor(private el: ElementRef,public donateFlow: DonateFlowService ) {}

  ngOnInit(): void {
    const header = this.el.nativeElement.querySelector('.top-header');
    animate(header, { opacity: [0, 1], y: [-20, 0] }, this.animOptions1);

    const nav = this.el.nativeElement.querySelector('.main-nav');
    animate(nav, { opacity: [0, 1], y: [-10, 0] }, this.animOptions2);
  }

  toggleMenu(): void {
    this.mobileMenuOpen.update(v => !v);
  }

  //openDonateModal(): void { this.donateModalOpen.set(true); }

  //closeDonateModal(): void { this.donateModalOpen.set(false); }

  closeMobileMenu(): void { this.mobileMenuOpen.set(false); }
}
