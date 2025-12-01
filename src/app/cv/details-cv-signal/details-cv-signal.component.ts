import { Component, OnInit, inject, resource, signal } from '@angular/core';
import { Cv } from '../model/cv';
import { CvService } from '../services/cv.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { APP_ROUTES } from '../../../config/routes.config';
import { AuthService } from '../../auth/services/auth.service';
import { DefaultImagePipe } from '../pipes/default-image.pipe';
import { rxResource } from '@angular/core/rxjs-interop';
import { catchError, EMPTY, firstValueFrom, tap, throwError } from 'rxjs';

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

   cvResource = resource<Cv | null, number>({
    params: () => this.id(),
    loader: async ({ params: cvId }) => {
      const cvData = await firstValueFrom(this.cvService.getCvById(cvId));
      this.cv.set(cvData);
      return cvData;
    },
    defaultValue: null
  });

 cvToDelete = signal<Cv | null>(null);
  deleteResource = resource<void, Cv | null>({
    params: () => this.cvToDelete(),
    loader: async ({ params: cv }) => {
      if (!cv) return;
      await firstValueFrom(
        this.cvService.deleteCvById(cv.id).pipe(
          tap(() => {
            this.router.navigate(['/cv']);
          })
        )
      );
    },
    defaultValue: undefined
  });

  deleteCv(cv: Cv) {
    this.cvToDelete.set(cv);    
    this.deleteResource.reload(); 
  }
}