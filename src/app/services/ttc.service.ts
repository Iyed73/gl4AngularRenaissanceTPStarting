import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TtcService {

  prixTTC(prixHT: number, tva: number): number {
    return prixHT + (prixHT * tva / 100);
  }

  remise(total: number, quantite: number): number {
    if (quantite >= 10 && quantite <= 15) return total * 0.2;
    if (quantite > 15) return total * 0.3;
    return 0;
  }

  prixTotal(prixHT: number, quantite: number, tva: number): number {
    const total = this.prixTTC(prixHT, tva) * quantite;
    return total - this.remise(total, quantite);
  }
}
