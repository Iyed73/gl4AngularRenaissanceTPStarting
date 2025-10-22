import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { combineLatest, map, startWith } from 'rxjs';
import { TtcService } from '../services/ttc.service';

@Component({
  selector: 'app-ttc-calculator',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './ttc-calculator.component.html',
  styleUrls: ['./ttc-calculator.component.css']
})
export class TtcCalculatorComponent {

  prixHT = new FormControl<number>(0);
  quantite = new FormControl<number>(1);
  tva = new FormControl<number>(18);

 result$ = combineLatest([
  this.prixHT.valueChanges.pipe(startWith(this.prixHT.value)),
  this.quantite.valueChanges.pipe(startWith(this.quantite.value)),
  this.tva.valueChanges.pipe(startWith(this.tva.value))
]).pipe(
  map(([prixHT, quantite, tva]) => {
    const p = prixHT ?? 0;
    const q = quantite ?? 1;
    const t = tva ?? 0;

    const prixTTC = this.ttcService.prixTTC(p, t);
    const total = this.ttcService.prixTotal(p, q, t) ;
    const discount = this.ttcService.remise(total, q);

    return { prixTTC, total, discount };
  })
);


  constructor(private ttcService: TtcService) {}
}
