import { Component, OnInit,  } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { RdvService } from '../rdv.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { RDV } from '../rdv.model';


export interface Salle {
  value: string;
}

@Component({
  selector: 'app-rdv-create',
  templateUrl: './rdv-create.component.html',
  styleUrls: ['./rdv-create.component.css']
})
export class RdvCreateComponent implements OnInit {
  enteredMedecin = '';
  enteredDate = '';
  rdv: RDV;
  isLoading = false;
  forms: FormGroup;
  private mode = 'create';
  private rdvId: string;
  salles: Salle[] = [
    {value: 'Salle de consultation E/1'},
    {value: 'Salle de consultation E/2'},
    {value: 'Salle de consultation E/3'},
    {value: 'Salle de consultation A/1'},
    {value: 'Salle de consultation F/2'},
    {value: 'Salle de consultation D/3'}
  ];
  types: Salle[] = [
    {value: 'neurologie'},
    {value: 'coroneurographie'},
    {value: 'transfert de sang'},
    {value: 'Checking journalier'}
  ];
  docteurs: Salle[] = [
    {value: 'Dr.Chérif Abdelkhirane'},
    {value: 'Dr.Tazi'},
    {value: 'Dr.Hachalf khadija'},
    {value: 'Dr.mounia'}
  ];
  constructor(
    public rdvService: RdvService,
    public route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.forms = new FormGroup({
      medecin: new FormControl(null, {
        validators: [Validators.required]
      }),
      daterdv: new FormControl(null, { validators: [Validators.required] }),
      salle: new FormControl(null, { validators: [Validators.required] }),
      type: new FormControl(null, { validators: [Validators.required] })
    });
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('rdvId')) {
        this.mode = 'edit';
        this.rdvId = paramMap.get('rdvId');
        this.isLoading = true;
        this.rdvService.getRdv(this.rdvId).subscribe(rdvData => {
          this.isLoading = false;
          this.rdv = {
            id: rdvData._id,
            medecin: rdvData.medecin,
            daterdv: rdvData.daterdv,
            salle:   rdvData.salle,
            type:    rdvData.type,
            creator: rdvData.creator
          };
          this.forms.setValue({
            medecin: this.rdv.medecin,
            daterdv: this.rdv.daterdv,
            salle: this.rdv.salle,
            type: this.rdv.type
          });
        });
      } else {
        this.mode = 'create';
        this.rdvId = null;
      }
    });
  }

  onSaveRdv() {
    if (this.forms.invalid) {
      return;
    }
    this.isLoading = false;
    if (this.mode === 'create') {
      this.rdvService.addRdv(
        this.forms.value.medecin,
        this.forms.value.daterdv,
        this.forms.value.salle,
        this.forms.value.type
      );
    } else {
      this.rdvService.updateRdv(
        this.rdvId,
        this.forms.value.medecin,
        this.forms.value.daterdv,
        this.forms.value.salle,
        this.forms.value.type
      );
    }
    this.forms.reset();
  }
}
