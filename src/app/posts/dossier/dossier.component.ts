import { Component, OnInit,  } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { PostsService } from '../posts.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Dossier } from '../dossier.model';

@Component({
  selector: 'app-dossier',
  templateUrl: './dossier.component.html',
  styleUrls: ['./dossier.component.css']
})
export class DossierComponent implements OnInit {
  enteredTitle = '';
  enteredContent = '';
  dossier: Dossier;
  isLoading = false;
  form: FormGroup;
  private mode = 'create';
  private dossierId: string;


  constructor(
    public postsService: PostsService,
    public route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.form = new FormGroup({
      nomPatient: new FormControl(null, {
        validators: [Validators.required]
      }),
      prenomPatient: new FormControl(null, { validators: [Validators.required] }),
      dateNaissance: new FormControl(null, { validators: [Validators.required] }),
      adresse: new FormControl(null, { validators: [Validators.required] }),
      mutuelle: new FormControl(null, { validators: [Validators.required] }),
      tel: new FormControl(null, { validators: [Validators.required] }),
      numAdmission: new FormControl(null, { validators: [Validators.required] }),
      medecinTraitant: new FormControl(null, { validators: [Validators.required] }),
      medecinResponsable: new FormControl(null, { validators: [Validators.required] }),
      poids: new FormControl(null, { validators: [Validators.required] }),
      taille: new FormControl(null, { validators: [Validators.required] }),

    });
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('dossierId')) {
        this.mode = 'edit';
        this.dossierId = paramMap.get('dossierId');
        this.isLoading = true;
        this.postsService.getDossier(this.dossierId).subscribe(dossierData => {
          this.isLoading = false;
          this.dossier = {
            id: dossierData._id,
            nomPatient: dossierData.nomPatient,
            prenomPatient: dossierData.prenomPatient,
            dateNaissance: dossierData.dateNaissance,
            adresse: dossierData.adresse,
            mutuelle: dossierData.mutuelle,
            tel: dossierData.tel,
            numAdmission: dossierData.numAdmission,
            medecinTraitant: dossierData.medecinTraitant,
            medecinResponsable: dossierData.medecinResponsable,
            poids: dossierData.poids,
            taille: dossierData.taille,
            creator: dossierData.creator
          };
          this.form.setValue({
            nomPatient: this.dossier.nomPatient,
            prenomPatient: this.dossier.prenomPatient,
            dateNaissance: this.dossier.dateNaissance,
            adresse: this.dossier.adresse,
            mutuelle: this.dossier.mutuelle,
            tel: this.dossier.tel,
            numAdmission: this.dossier.numAdmission,
            medecinTraitant: this.dossier.medecinTraitant,
            medecinResponsable: this.dossier.medecinResponsable,
            poids: this.dossier.poids,
            taille: this.dossier.taille
          });
        });
      } else {
        this.mode = 'create';
        this.dossierId = null;
      }
    });
  }

  onSaveDossier() {
    if (this.form.invalid) {
      return;
    }
    this.isLoading = true;
    if (this.mode === 'create') {
      this.postsService.addDossier(
        this.form.value.nomPatient,
        this.form.value.prenomPatient,
        this.form.value.dateNaissance,
        this.form.value.adresse,
        this.form.value.mutuelle,
        this.form.value.tel,
        this.form.value.numAdmission,
        this.form.value.medecinTraitant,
        this.form.value.medecinResponsable,
        this.form.value.poids,
        this.form.value.taille
      );
    } else {
      this.postsService.updateDossier(
        this.dossierId,
        this.form.value.nomPatient,
        this.form.value.prenomPatient,
        this.form.value.dateNaissance,
        this.form.value.adresse,
        this.form.value.mutuelle,
        this.form.value.tel,
        this.form.value.numAdmission,
        this.form.value.medecinTraitant,
        this.form.value.medecinResponsable,
        this.form.value.poids,
        this.form.value.taille
      );
    }
    this.form.reset();
  }
}
