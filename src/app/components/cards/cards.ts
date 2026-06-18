import {Component, ElementRef} from '@angular/core';
import {animate, inView} from 'motion';

// 1. On extrait dynamiquement les types stricts de Motion One
type MotionProperties = Parameters<typeof animate>[1];
type MotionOptions = Parameters<typeof animate>[2];

interface InfoCard {
  icon: string;
  title: string;
  description: string;
  link: string;
  linkLabel: string;
  color: string;
}


@Component({
  selector: 'app-cards',
  imports: [],
  templateUrl: './cards.html',
  styleUrl: './cards.css',
})
export class Cards {



  cards: InfoCard[] = [
    {
      icon: 'fas fa-bible',
      title: 'Sermon du Dimanche',
      description: 'Rejoignez-nous chaque dimanche à 10h pour un message inspirant. Cette semaine : « La Foi qui déplace les montagnes ».',
      link: '#sermons',
      linkLabel: 'Écouter',
      color: 'coral'
    },
    {
      icon: 'fas fa-calendar-alt',
      title: 'Prochain Événement',
      description: 'Soirée de louange & adoration le 28 juin à 19h. Venez avec votre famille. Entrée libre et gratuite.',
      link: '#events',
      linkLabel: 'S\'inscrire',
      color: 'gold'
    },
    {
      icon: 'fas fa-hands-helping',
      title: 'Soutien & Prière',
      description: 'Notre équipe de prière est disponible pour vous. Partagez vos besoins en toute confidentialité.',
      link: '#contact',
      linkLabel: 'Nous contacter',
      color: 'coral'
    }
  ];

  constructor(private el: ElementRef) {}

  ngOnInit(): void {
    inView(this.el.nativeElement, () => {
      const animationProps: MotionProperties = {
        opacity: [0, 1],
        y: [50, 0]
      };

      const cards = this.el.nativeElement.querySelectorAll('.info-card');
      cards.forEach((card: Element, i: number) => {

        const animationOptions: MotionProperties = {
          duration: 0.6,
          delay: i * 0.15,
          easing: [0.22,1,0.36,1],
        };
        animate(
          card as HTMLElement,
          animationProps,
          animationOptions);
      });
    }, { margin: '-80px' });
  }
}
