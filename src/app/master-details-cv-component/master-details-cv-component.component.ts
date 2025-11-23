import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable, catchError, of } from 'rxjs';
import { ItemComponent } from '../cv/item/item.component';
import { Cv } from '../cv/model/cv';
import { CvService } from '../cv/services/cv.service';

@Component({
  selector: 'app-master-details-cv',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, RouterOutlet, ItemComponent],
  templateUrl: './master-details-cv-component.component.html',
  styleUrls: ['./master-details-cv-component.component.css']
})
export class MasterDetailsCvComponent {
  private cvService = inject(CvService);
  private toastr = inject(ToastrService);

  cvs$: Observable<Cv[]> = this.cvService.getCvs().pipe(
    catchError((err) => {
      this.toastr.error(`Attention!! Les données sont fictives, problème avec le serveur. Veuillez contacter l'admin.`);
      return of(this.cvService.getFakeCvs());
    })
  );
}