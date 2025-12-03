import { rxResource } from '@angular/core/rxjs-interop';
import { Component, inject, signal } from '@angular/core';
import { Cv } from '../model/cv';
import { CvService } from '../services/cv.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../auth/services/auth.service';
import { DefaultImagePipe } from '../pipes/default-image.pipe';
import { of, tap } from 'rxjs';
import { LoggerService } from 'src/app/services/logger.service';

@Component({
  selector: 'app-details-cv-signal',
  templateUrl: './details-cv-signal.component.html',
  styleUrls: ['./details-cv-signal.component.css'],
  standalone: true,
  imports: [DefaultImagePipe],
})
export class DetailsCvSignalComponent {
  private logger = inject(LoggerService);
  private cvService = inject(CvService);
  private router = inject(Router);
  private toastr = inject(ToastrService);

  authService = inject(AuthService);
  cv = signal<Cv | null>(null);
  private activatedRoute = inject(ActivatedRoute);
  private id = signal(+this.activatedRoute.snapshot.params['id']);

  cvResource = rxResource<Cv | null, number>({
    params: () => this.id(),
    stream: ({ params: cvId }) => {
      return this.cvService.getCvById(cvId).pipe(
        tap((cvData) => {
          this.cv.set(cvData);
        })
      );
    },
    defaultValue: null,
  });

  cvToDelete = signal<Cv | null>(null);
  deleteResource = rxResource<null, Cv | null>({
    params: () => this.cvToDelete(),
    stream: ({ params: cv }) => {
      if (!cv) return of(null);

      return this.cvService.deleteCvById(cv.id).pipe(
        tap(() => {
          this.router.navigate(['/cv']);
        })
      );
    },
    defaultValue: undefined,
  });

  deleteCv(cv: Cv) {
    this.cvToDelete.set(cv);
    this.deleteResource.reload();
  }
}
