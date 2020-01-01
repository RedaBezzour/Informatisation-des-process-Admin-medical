import { Component, OnInit, OnDestroy, Pipe, PipeTransform } from '@angular/core';
import { Subscription } from 'rxjs';

import { RDV } from '../rdv.model';
import { RdvService } from '../rdv.service';
import { AuthService } from 'src/app/auth/auth.service';

@Pipe({
  name: 'searchFilter'
})
export class SearchFilter implements PipeTransform {
  transform(rdvs: RDV[], criteria: any): any {

      return rdvs.filter(item => {
         for (let key in item ) {
           if (('' + item[key]).includes(criteria)) {
              return true;
           }
         }
         return false;
      });
  }
}

@Component({
  selector: 'app-rdv-list',
  templateUrl: './rdv-list.component.html',
  styleUrls: ['./rdv-list.component.css']
})
export class RdvListComponent implements OnInit, OnDestroy {
  rdvs: RDV[] = [];
  private rdvsSub: Subscription;
  private authStatusSub: Subscription;
  userIsAuthenticated = false;
  isLoading = false;
  userId: string;

  constructor(public rdvsService: RdvService,  private authService: AuthService) {}

  ngOnInit() {
    this.rdvsService.getRdvs();
    this.userId = this.authService.getUserId();
    console.log(this.userId);
    this.rdvsSub = this.rdvsService.getRdvUpdateListener()
      .subscribe((rdvs: RDV[]) => {
        this.rdvs = rdvs;
      });
    this.userIsAuthenticated = this.authService.getIsAuth();
    console.log(this.authService.getIsAuth());
    this.authStatusSub = this.authService
      .getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
        this.userId = this.authService.getUserId();
      });
  }

  ngOnDestroy() {
    this.rdvsSub.unsubscribe();
    this.authStatusSub.unsubscribe();
  }
  onDelete(rdvId: string) {
    this.rdvsService.deleteRdv(rdvId).subscribe(() => {
      this.rdvsService.getRdvs();
    }, () => {
      this.isLoading = false;
    });
  }
}
