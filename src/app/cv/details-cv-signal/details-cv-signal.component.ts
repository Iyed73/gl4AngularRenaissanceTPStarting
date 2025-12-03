import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { Component, inject, signal } from '@angular/core';
import { Cv } from '../model/cv';
import { CvService } from '../services/cv.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../auth/services/auth.service';
import { DefaultImagePipe } from '../pipes/default-image.pipe';
import { debounceTime, distinctUntilChanged, map, of, tap } from 'rxjs';
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
  private id = toSignal(
    this.activatedRoute.params.pipe(
      map(p => {
          console.log(p["id"]);
        return +p['id']
       ||
        null
      }
      )
    ),
    { initialValue: null }
  );

  cvResource = rxResource<Cv | null, number|null>({
    params: () => this.id(),
    stream: ({ params: cvId }) => {
      this.cv.set(null);
      if (!cvId) return of(null);
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
