import {Injectable, signal} from '@angular/core';
import {environment} from '../../../environments/environment';

/**
 * Gère l'état (ouvert/fermé) de la modale de choix de don, permettant de la
 * déclencher depuis n'importe quel endroit de l'application (bouton « Faire un don »
 * de l'en-tête, bouton « Retour » de la page de don, etc.) sans que ces
 * composants n'aient besoin d'une relation directe parent-enfant.
 */

@Injectable({
  providedIn: 'root',
})
export class DonateFlowService {

  readonly isOpen = signal(false);

  open(): void {
    this.isOpen.set(true);
  }

  close(): void {
    this.isOpen.set(false);
  }

}
