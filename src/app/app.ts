import {Component} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {Toast} from 'primeng/toast';
import {Header} from './components/header/header';
import {Hero} from './components/hero/hero';
import {Cards} from './components/cards/cards';
import {Footer} from './components/footer/footer';

@Component({
  standalone: true,
  selector: 'app-root',
  imports: [
    //RouterOutlet,
    Header,
    //Toast,
    Hero,
    Cards,
    Footer
  ],
  template:`
    <div>
      <app-header/>
      <main>
        <app-hero/>
        <app-cards/>
      </main>
      <app-footer/>
    </div>`,
  styleUrl: './app.css'
})
export class App{
  protected title = 'wcip-giving-platform';
}
