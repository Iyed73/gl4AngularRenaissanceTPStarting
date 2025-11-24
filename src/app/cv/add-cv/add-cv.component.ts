import { Component, OnInit } from "@angular/core";
import {
  AbstractControl,
  AsyncValidatorFn,
  FormBuilder,
  ValidationErrors,
  Validators,
} from "@angular/forms";
import { CvService } from "../services/cv.service";
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { APP_ROUTES } from "src/config/routes.config";
import { Cv } from "../model/cv";
import { Observable, of } from "rxjs";
import { map, catchError } from "rxjs/operators";

@Component({
  selector: "app-add-cv",
  templateUrl: "./add-cv.component.html",
  styleUrls: ["./add-cv.component.css"],
})
export class AddCvComponent implements OnInit {
  constructor(
    private cvService: CvService,
    private router: Router,
    private toastr: ToastrService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit() {
    this.age.valueChanges.subscribe(() => {
      if (this.cin.value) {
        this.cin.updateValueAndValidity();
      }
    });
  }

  cinUniqueValidator(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      const cin = control.value;
      if (!cin || cin.length === 0) {
        return of(null);
      }
      return this.cvService.selectByProperty("cin", cin).pipe(
        map((cvs) => {
          return cvs && cvs.length > 0 ? { cinNotUnique: true } : null;
        }),
        catchError(() => of(null))
      );
    };
  }

  cinAgeCorrelationValidator(control: AbstractControl): ValidationErrors | null {
    const cin = control.value;
    const ageControl = control.parent?.get("age");
    const age = ageControl?.value;

    if (!cin || !age || cin.length !== 8 || isNaN(age)) {
      return null;
    }

    if (!cin.split('').every((char: string) => char >= '0' && char <= '9')) {
      return null;
    }

    const firstTwoDigits = parseInt(cin.substring(0, 2), 10);

    if (age >= 60) {
      if (firstTwoDigits < 0 || firstTwoDigits > 19) {
        return { cinAgeCorrelation: true };
      }
    } else {
      if (firstTwoDigits <= 19) {
        return { cinAgeCorrelation: true };
      }
    }

    return null;
  }

  form = this.formBuilder.group(
    {
      name: ["", Validators.required],
      firstname: ["", Validators.required],
      path: [""],
      job: ["", Validators.required],
      cin: [
        "",
        {
          validators: [
            Validators.required,
            Validators.pattern("[0-9]{8}"),
            this.cinAgeCorrelationValidator.bind(this),
          ],
          asyncValidators: [this.cinUniqueValidator()],
        },
      ],
      age: [
        0,
        {
          validators: [Validators.required],
        },
      ],
    },
  );

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
    return this.form.get("name")!;
  }
  get firstname() {
    return this.form.get("firstname");
  }
  get age(): AbstractControl {
    return this.form.get("age")!;
  }
  get job() {
    return this.form.get("job");
  }
  get path() {
    return this.form.get("path");
  }
  get cin(): AbstractControl {
    return this.form.get("cin")!;
  }
}
