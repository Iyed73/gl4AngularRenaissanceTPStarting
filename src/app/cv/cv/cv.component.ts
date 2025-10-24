import { Component, inject } from "@angular/core";
import { LoggerService } from "../../services/logger.service";
import { ToastrService } from "ngx-toastr";
import { CvService } from "../services/cv.service";
import { ListComponent } from "../list/list.component";
import { CvCardComponent } from "../cv-card/cv-card.component";
import { EmbaucheComponent } from "../embauche/embauche.component";
import { UpperCasePipe, DatePipe } from "@angular/common";
@Component({
    selector: "app-cv",
    templateUrl: "./cv.component.html",
    styleUrls: ["./cv.component.css"],
    standalone: true,
    imports: [
        ListComponent,
        CvCardComponent,
        EmbaucheComponent,
        UpperCasePipe,
        DatePipe,
    ],
})
export class CvComponent {
  private logger = inject(LoggerService);
  private toastr = inject(ToastrService);
  cvService = inject(CvService);

  cvs = this.cvService.cvs;
  selectedCv = this.cvService.selectedCv;
  date = new Date();

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);

  constructor() {
    this.cvService.loadCvs(() => {
      this.toastr.error(`
        Attention!! Les données sont fictives, problème avec le serveur.
        Veuillez contacter l'admin.`);
    });
    this.logger.logger("je suis le cvComponent");
    this.toastr.info("Bienvenu dans notre CvTech");
  }
}
