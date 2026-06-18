import {AfterViewInit, Component, ElementRef, ViewChild} from '@angular/core';
import {animate, spring} from 'motion';

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements AfterViewInit {

  @ViewChild('quoteBox') quoteBox!: ElementRef;

  // Utilisation des Signals d'Angular pour une réactivité moderne
  isMenuOpen = false;

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  ngAfterViewInit() {
    // Animation d'entrée du Hero Box
    animate(
      this.quoteBox.nativeElement,
      { opacity: [0, 1], y: [30, 0], scale: [0.97, 1] },
      //{ duration: 1, easing: spring({ stiffness: 90, damping: 14 }) }
    );

    // Animation fluide des cartes
    //animate(
      //'.card',
      //{ opacity: [0, 1], y: [40, 0] },
     // { duration: 0.6, delay: 0.3, easing: 'ease-out' }
    //);

    }

}
