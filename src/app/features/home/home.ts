import {Component} from '@angular/core';
import {Hero} from '../../components/hero/hero';
import {Cards} from '../../components/cards/cards';

@Component({
  selector: 'app-home',
  imports: [
    Hero,
    Cards,
  ],
  template:`
    <app-hero />
    <app-cards />`,
  styleUrl: './home.css',
})
export class Home {
}
