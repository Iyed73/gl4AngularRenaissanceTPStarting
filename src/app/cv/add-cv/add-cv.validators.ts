import { AbstractControl, AsyncValidatorFn, ValidationErrors } from "@angular/forms";
import { Observable, of } from "rxjs";
import { map, catchError } from "rxjs/operators";
import { CvService } from "../services/cv.service";

export function cinUniqueValidator(cvService: CvService): AsyncValidatorFn {
  return (control: AbstractControl): Observable<ValidationErrors | null> => {
    const cin = control.value;
    if (!cin || cin.length === 0) {
      return of(null);
    }
    return cvService.selectByProperty("cin", cin).pipe(
      map((cvs) => {
        return cvs && cvs.length > 0 ? { cinNotUnique: true } : null;
      }),
      catchError(() => of(null))
    );
  };
}

export function cinAgeCorrelationValidator(
  control: AbstractControl
): ValidationErrors | null {
  const cin = control.value;
  const ageControl = control.parent?.get("age");
  const age = ageControl?.value;

  if (!cin || !age || cin.length !== 8 || isNaN(age)) {
    return null;
  }

  if (!cin.split("").every((char: string) => char >= "0" && char <= "9")) {
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

