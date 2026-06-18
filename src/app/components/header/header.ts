import {Component, ElementRef, OnInit, signal} from '@angular/core';
import { animate} from 'motion';
import {RouterLink} from '@angular/router';
import {DonateModal} from '../donate-modal/donate-modal';

type MotionOptions = Parameters<typeof animate>[2];
@Component({
  selector: 'app-header',
  imports: [
    RouterLink,
    DonateModal,
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
    { label: 'Accueil', href: '#home', active: true },
    //{ label: 'À propos', href: '#about', active: false },
    { label: 'Événements', href: '#events', active: false },
    { label: 'Ressources', href: '#gallery', active: false },
    { label: 'Témoignages', href: '#sermons', active: false },
    { label: 'Boutique', href: '#donation', active: false },
    { label: 'Contact', href: '#donation', active: false },
  ];

  socialLinks = [
    { icon: 'fab fa-facebook-f', href: '#', label: 'Facebook' },
    { icon: 'fab fa-youtube', href: '#', label: 'YouTube' },
    { icon: 'fab fa-instagram', href: '#', label: 'Instagram' },
    { icon: 'fab fa-twitter', href: '#', label: 'Twitter' },
  ];

  constructor(private el: ElementRef, ) {}

  ngOnInit(): void {
    const header = this.el.nativeElement.querySelector('.top-header');
    animate(header, { opacity: [0, 1], y: [-20, 0] }, this.animOptions1);

    const nav = this.el.nativeElement.querySelector('.main-nav');
    animate(nav, { opacity: [0, 1], y: [-10, 0] }, this.animOptions2);
  }

  toggleMenu(): void {
    this.mobileMenuOpen.update(v => !v);
  }

  setActive(index: number): void {
    this.navLinks.forEach((l, i) => l.active = i === index);
  }


  openDonateModal(): void {
    this.donateModalOpen.set(true);
  }

  closeDonateModal(): void {
    this.donateModalOpen.set(false);
  }

}
