import { Component, Input } from '@angular/core';


@Component({
  selector: 'app-loader',
  imports: [],
  templateUrl: './loader.html',
  styleUrl: './loader.css',
  standalone: true
})
export class Loader {
  @Input() message = 'Chargement en cours...';
  @Input() fullscreen = true;
}
