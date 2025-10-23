import { Component, inject } from '@angular/core';
import { Cv } from '../model/cv';
import { CvService } from '../services/cv.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { APP_ROUTES } from '../../../config/routes.config';
import { AuthService } from '../../auth/services/auth.service';
import { catchError, map, of, switchMap } from 'rxjs';

@Component({
  selector: 'app-details-cv',
  templateUrl: './details-cv.component.html',
  styleUrls: ['./details-cv.component.css'],
})
export class DetailsCvComponent {
  private cvService = inject(CvService);
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private toastr = inject(ToastrService);
  public authService = inject(AuthService);
  cv$ = this.activatedRoute.params.pipe(
    switchMap((params) =>
      this.cvService.getCvById(+params['id']).pipe(
        catchError((error) => {
          // handle error reactively
          this.toastr.error(
            `Erreur: impossible de récupérer le CV. Redirection en cours...`
          );
          this.router.navigate([APP_ROUTES.cv]);
          return of(null);
        })
      )
    )
  );

  constructor() {}

  deleteCv(cv: Cv) {
    this.cvService.deleteCvById(cv.id).subscribe({
      next: () => {
        this.toastr.success(`${cv.name} supprimé avec succès`);
        this.router.navigate([APP_ROUTES.cv]);
      },
      error: () => {
        this.toastr.error(
          `Problème avec le serveur, veuillez contacter l'admin.`
        );
      },
    });
  }
}
