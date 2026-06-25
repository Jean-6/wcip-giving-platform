import {Component} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {Header} from './components/header/header';
import {Footer} from './components/footer/footer';

@Component({
  standalone: true,
  selector: 'app-root',
  imports: [
    Header,
    Footer,
    RouterOutlet
  ],
  template:`
    <div>
      <app-header/>
      <main>
        <router-outlet></router-outlet>
      </main>
      <app-footer/>
    </div>`,
  styleUrl: './app.css'
})
export class App{
  protected title = 'wcip-giving-platform';
}
