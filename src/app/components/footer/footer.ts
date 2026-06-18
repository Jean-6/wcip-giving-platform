import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  imports: [],
  templateUrl: './footer.html',
  styleUrl: './footer.css',
})
export class Footer {
  year = new Date().getFullYear();

  quickLinks = [
    { label: 'Accueil', href: '#home' },
    { label: 'À propos', href: '#about' },
    { label: 'Événements', href: '#events' },
    { label: 'Faire un don', href: '#donation' },
  ];

  serviceTimes = [
    { day: 'Mercredi', time: '18h00 — 19h30' },
    { day: 'Dimanche', time: '1er Service : 9h00 - 11h15' },
    { day: '', time: '2e Service : 11h15 - 13h15' },

  ];

  socialLinks = [
    { icon: 'fab fa-facebook-f', href: '#', label: 'Facebook' },
    { icon: 'fab fa-youtube', href: '#', label: 'YouTube' },
    { icon: 'fab fa-instagram', href: '#', label: 'Instagram' },
    { icon: 'fab fa-twitter', href: '#', label: 'Twitter' },
  ];
}
