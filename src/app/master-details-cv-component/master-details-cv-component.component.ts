import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable, catchError, of, tap } from 'rxjs';
import { ItemComponent } from '../cv/item/item.component';
import { Cv } from '../cv/model/cv';
import { CvService } from '../cv/services/cv.service';
import { rxResource } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-master-details-cv',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive,
    RouterOutlet,
    ItemComponent,
  ],
  templateUrl: './master-details-cv-component.component.html',
  styleUrls: ['./master-details-cv-component.component.css'],
})
export class MasterDetailsCvComponent {
  private cvService = inject(CvService);
  private toastr = inject(ToastrService);
  cvs = signal<Cv[] | null>([]);

  // Resource fetches data and updates the signal automatically
  cvsResource = rxResource<Cv[] | null, void>({
    stream: () => {
      return this.cvService.getCvs().pipe(
        tap((cvData) => {
          this.cvs.set(cvData);
        })
      );
    },
    defaultValue: null,
  });
}
