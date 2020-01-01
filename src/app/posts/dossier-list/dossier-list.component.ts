import { Component, OnInit, OnDestroy, Pipe, PipeTransform } from '@angular/core';
import { Subscription } from 'rxjs';

import { Dossier } from '../dossier.model';
import { PostsService } from '../posts.service';
import { AuthService } from 'src/app/auth/auth.service';

@Pipe({
  name: 'searchFilter'
})
export class SearchFilter implements PipeTransform {
  transform(dossiers: Dossier[], criteria: any): any {

      return dossiers.filter(item => {
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
  selector: 'app-dossier-list',
  templateUrl: './dossier-list.component.html',
  styleUrls: ['./dossier-list.component.css']
})
export class DossierListComponent implements OnInit, OnDestroy {
  dossiers: Dossier[] = [];
  private dossiersSub: Subscription;
  private authStatusSub: Subscription;
  userIsAuthenticated = false;
  isLoading = false;
  userId: string;

  constructor(public postsService: PostsService,  private authService: AuthService) {}

  ngOnInit() {
    this.postsService.getDossiers();
    this.userId = this.authService.getUserId();
    this.dossiersSub = this.postsService.getDossierUpdateListener()
      .subscribe((dossiers: Dossier[]) => {
        this.dossiers = dossiers;
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
    this.dossiersSub.unsubscribe();
    this.authStatusSub.unsubscribe();
  }
  onDelete(dossierId: string) {
    this.postsService.deleteDossier(dossierId).subscribe(() => {
      this.postsService.getDossiers();
    }, () => {
      this.isLoading = false;
    });
  }
}
