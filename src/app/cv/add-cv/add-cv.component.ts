import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { CvService } from '../services/cv.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { APP_ROUTES } from 'src/config/routes.config';
import { Cv } from '../model/cv';
import { debounceTime, distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'app-add-cv',
  templateUrl: './add-cv.component.html',
  styleUrls: ['./add-cv.component.css'],
})
export class AddCvComponent {
  private formStorageKey = 'cv_draft';
  constructor(
    private cvService: CvService,
    private router: Router,
    private toastr: ToastrService,
    private formBuilder: FormBuilder
  ) {
    this.loadDraft();

    this.age.valueChanges.pipe(debounceTime(500)).subscribe((age) => {
      if (age < 18) {
        this.path?.patchValue('');
        this.path?.disable();
      } else {
        this.path?.enable();
      }
    });

    this.form.valueChanges
      .pipe(debounceTime(2000), distinctUntilChanged())
      .subscribe(() => {
        this.saveDraft();
      });
  }

  form = this.formBuilder.group({
    name: ['', Validators.required],
    firstname: ['', Validators.required],
    path: [''],
    job: ['', Validators.required],
    cin: [
      '',
      {
        validators: [Validators.required, Validators.pattern('[0-9]{8}')],
      },
    ],
    age: [
      0,
      {
        validators: [Validators.required],
      },
    ],
  });

  addCv() {
    this.cvService.addCv(this.form.value as Cv).subscribe({
      next: (cv) => {
        this.router.navigate([APP_ROUTES.cv]);
        this.toastr.success(`Le cv ${cv.firstname} ${cv.name}`);
      },
      error: (err) => {
        this.toastr.error(
          `Une erreur s'est produite, Veuillez contacter l'admin`
        );
      },
    });
  }

  get name(): AbstractControl {
    return this.form.get('name')!;
  }
  get firstname() {
    return this.form.get('firstname');
  }
  get age(): AbstractControl {
    return this.form.get('age')!;
  }
  get job() {
    return this.form.get('job');
  }
  get path() {
    return this.form.get('path');
  }
  get cin(): AbstractControl {
    return this.form.get('cin')!;
  }

  saveDraft() {
    console.log('saveDraft');
    localStorage.setItem(this.formStorageKey, JSON.stringify(this.form.value));
  }

  loadDraft() {
    console.log('loadDraft');
    const savedDraft = localStorage.getItem(this.formStorageKey);
    if (savedDraft) {
      const parsedDraft = JSON.parse(savedDraft) as Cv;
      this.form.patchValue(parsedDraft);
      this.form.markAsDirty();
    }
  }
}
