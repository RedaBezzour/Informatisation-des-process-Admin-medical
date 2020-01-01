import { RDV } from './rdv.model';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { map} from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({providedIn: 'root'})
export class RdvService {
  private rdvs: RDV[] = [];
  private rdvsUpdated = new Subject<RDV[]>();

  constructor(private http: HttpClient, private router: Router) {}

  getRdvs() {
    this.http
      .get<{ message: string; rdvs: any }>(
        'http://localhost:3000/api/rdv'
      )
      .pipe(map((rdvData) => {
        return rdvData.rdvs.map(rdv => {
          return {
            medecin: rdv.medecin,
            daterdv: rdv.daterdv,
            salle: rdv.salle,
            type: rdv.type,
            id: rdv._id,
            creator: rdv.creator
          };
        });
      }))
      .subscribe(transformedRdv => {
        this.rdvs = transformedRdv;
        this.rdvsUpdated.next([...this.rdvs]);
      });
  }

  getRdv(id: string) {
    return this.http.get<{
      _id: string;
      medecin: string;
      salle: string;
      type: string;
      daterdv: string;
      creator: string;
    }>('http://localhost:3000/api/rdv/' + id);
  }

  getRdvUpdateListener() {
    return this.rdvsUpdated.asObservable();
  }

  addRdv(medecin: string, daterdv: string, salle: string, type: string) {
    const rdvData = {medecin , daterdv, salle, type};
    this.http
    .post<{ message: string; rdv: RDV }>(
      'http://localhost:3000/api/rdv',
      rdvData
    )
    .subscribe(responseData => {
      this.router.navigate(['/listRdv']);
    });
  }

  updateRdv(id: string, medecin: string, daterdv: string, salle: string, type: string) {
    const rdvData = {id, medecin, daterdv, salle, type, creator: null};
    this.http
      .put('http://localhost:3000/api/rdv/' + id, rdvData)
      .subscribe(response => {
        this.router.navigate(['/listRdv']);
      });
  }


  deleteRdv(rdvId: string) {
    return this.http.delete('http://localhost:3000/api/rdv/' + rdvId);
  }
}
