import { Component, OnInit, inject, signal } from '@angular/core';
import { Cv } from '../model/cv';
import { CvService } from '../services/cv.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { APP_ROUTES } from '../../../config/routes.config';
import { AuthService } from '../../auth/services/auth.service';
import { DefaultImagePipe } from '../pipes/default-image.pipe';
import { rxResource } from '@angular/core/rxjs-interop';
import { catchError, EMPTY, tap, throwError } from 'rxjs';

@Component({
    selector: 'app-details-cv-signal',
    templateUrl: './details-cv-signal.component.html',
    styleUrls: ['./details-cv-signal.component.css'],
    standalone: true,
    imports: [DefaultImagePipe],
})
export class DetailsCvSignalComponent {
  private cvService = inject(CvService);
  private router = inject(Router);
  private toastr = inject(ToastrService);

  authService = inject(AuthService);
  cv = signal<Cv | null>(null);
  private activatedRoute = inject(ActivatedRoute);
  private id = signal(+this.activatedRoute.snapshot.params['id']);

  cvResource = rxResource<Cv, number>({
    params: () => this.id(),  
    stream: ({ params }) => this.cvService.getCvById(params).pipe(
      tap(cv => this.cv.set(cv))
    )
  });

 cvToDelete = signal<Cv | null>(null);
  deleteResource = rxResource<void, Cv | null>({
    params: () => this.cvToDelete(),  
    stream: ({ params: cv }) => {
      if (!cv) return EMPTY; 
      return this.cvService.deleteCvById(cv.id).pipe(
        tap(() => {
          this.toastr.success(`${cv.name} supprimé avec succès`);
          this.router.navigate(['/cv']);
        }),
        catchError((error) => {
        this.toastr.error(
          `Problème avec le serveur, veuillez contacter l'admin`
        );
        return EMPTY;
      })
      );
    }
  });

  deleteCv(cv: Cv) {
    this.cvToDelete.set(cv);    
    this.deleteResource.reload(); 
  }
}