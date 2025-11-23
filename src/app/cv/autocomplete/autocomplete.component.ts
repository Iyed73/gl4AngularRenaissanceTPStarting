import { Component, inject, OnInit } from "@angular/core";
import { FormBuilder, AbstractControl } from "@angular/forms";
import { debounceTime, distinctUntilChanged, switchMap } from "rxjs";
import { CvService } from "../services/cv.service";
import { Cv } from "../model/cv";

@Component({
  selector: "app-autocomplete",
  templateUrl: "./autocomplete.component.html",
  styleUrls: ["./autocomplete.component.css"],
})
export class AutocompleteComponent implements OnInit {
  formBuilder = inject(FormBuilder);
  cvService = inject(CvService);
  filteredCvs: Cv[] = [];

  get search(): AbstractControl {
    return this.form.get("search")!;
  }
  form = this.formBuilder.group({ search: [""] });

  ngOnInit() {
    this.search.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((searchTerm) => {
          if (searchTerm && searchTerm.trim()) {
            return this.cvService.selectByName(searchTerm);
          }
          return [];
        })
      )
      .subscribe((cvs) => {
        this.filteredCvs = cvs;
      });
  }

  onSelectCv(cv: Cv) {
    this.cvService.selectCv(cv);
    this.filteredCvs = [];
    this.search.setValue('');
  }
}
