import {Component, ElementRef, OnDestroy, OnInit, signal} from '@angular/core';
import {animate} from 'motion';
type MotionOptions = Parameters<typeof animate>[2];
type ScrollCallback = Parameters<typeof scroll>[0];


interface Slide {
  quote: string;
  highlight: string;
  ref: string;
  bg: string;
}

@Component({
  selector: 'app-hero',
  imports: [],
  templateUrl: './hero.html',
  styleUrl: './hero.css',
})
export class Hero implements OnInit, OnDestroy {

  showQuoteBox = signal<boolean>(true);

  animOptions1: MotionOptions = {
    duration: 0.8,
    delay: 0.4,
    ease: [0.22, 1, 0.36, 1]
  };

  animOptions2: MotionOptions = {
    duration: 0.6,
    delay: 0.9,
    ease: 'easeOut'
  };

  slides: Slide[] = [
    {
      quote: "Car c'est ainsi que Dieu a aimé le monde :",
      highlight: "il a donné son Fils unique",
      ref: "Jean 3:16",
      bg: 'assets/images/Bishop-David-Oyedepo1.jpg'
    },
    {
      quote: "Je suis le chemin, la vérité et la vie :",
      highlight: "nul ne vient au Père que par moi",
      ref: "Jean 14:6",
      bg: 'assets/images/illustration1.jpg'
    },
    {
      quote: "Venez à moi, vous tous qui êtes fatigués :",
      highlight: "je vous donnerai du repos",
      ref: "Matthieu 11:28",
      bg: 'assets/images/bible.jpg'
    }
  ];

  activeIndex = signal(0);
  private interval?: ReturnType<typeof setInterval>;

  constructor(private el: ElementRef) {}

  ngOnInit(): void {
    this.animateIn();
    this.startSlider();
    this.setupParallax();
  }

  ngOnDestroy(): void {
    if (this.interval) clearInterval(this.interval);
  }

  private animateIn(): void {
    const quoteBox = this.el.nativeElement.querySelector('.quote-box');
    if (quoteBox) {
      animate(quoteBox, { opacity: [0, 1], y: [40, 0] }, this.animOptions1);
    }
    const verse = this.el.nativeElement.querySelector('.verse-bar');
    if (verse) {
      animate(verse, { opacity: [0, 1], x: [-30, 0] }, this.animOptions2);
    }
  }

  private startSlider(): void {
    this.interval = setInterval(() => {
      this.activeIndex.update(i => (i + 1) % this.slides.length);
    }, 5000);
  }

  private setupParallax(): void {
    const hero = this.el.nativeElement.querySelector('.hero-bg');
    if (!hero) return;
    const handleScroll: ({y}: { y: any }) => void = ({ y })=>{
      const offset = y.progress * 80;
      hero.style.transform = `translateY(${offset}px)`;
    }
;
  }

  goTo(i: number): void {
    this.activeIndex.set(i);
    if (this.interval) {
      clearInterval(this.interval);
      this.startSlider();
    }
  }

  get current(): Slide {
    return this.slides[this.activeIndex()];
  }

  closeQuoteBox(): void {
    this.showQuoteBox.set(false);
  }
}
