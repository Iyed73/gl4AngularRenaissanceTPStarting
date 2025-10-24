import { Injectable, signal } from '@angular/core';
import { Cv } from '../model/cv';

@Injectable({
  providedIn: 'root',
})
export class EmbaucheService {
  /**
   * Signal writable pour la liste des embauchés
   */
  #embaucheesSignal = signal<Cv[]>([]);
  
  /**
   * Signal readonly pour la liste des embauchés
   */
  embauchees = this.#embaucheesSignal.asReadonly();

  constructor() {}

  /**
   *
   * Embauche une personne si elle ne l'est pas encore
   * Sinon il retourne false
   *
   * @param cv : Cv
   * @returns boolean
   */
  embauche(cv: Cv): boolean {
    const currentEmbauchees = this.#embaucheesSignal();
    const index = currentEmbauchees.findIndex(c => c.id === cv.id);
    
    if (index === -1) {
      this.#embaucheesSignal.update(embauchees => [...embauchees, cv]);
      return true;
    }
    return false;
  }
}
