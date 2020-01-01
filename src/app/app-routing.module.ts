import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PostListComponent } from './posts/post-list/post-list.component';
import { PostCreateComponent } from './posts/post-create/post-create.component';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { AuthGuard } from './auth/auth.guard';
import { RdvCreateComponent } from './rdv/rdv-create/rdv-create.component';
import { RdvListComponent } from './rdv/rdv-list/rdv-list.component';
import { DossierComponent } from './posts/dossier/dossier.component';
import { DossierListComponent } from './posts/dossier-list/dossier-list.component';

const routes: Routes = [
  {path: '', component: PostListComponent},
  {path: 'create', component: PostCreateComponent, canActivate: [AuthGuard]},
  {path: 'edit/:postId', component: PostCreateComponent, canActivate: [AuthGuard]},
  {path: 'editRdv/:rdvId', component: RdvCreateComponent, canActivate: [AuthGuard]},
  {path: 'editDossier/:dossierId', component: DossierComponent, canActivate: [AuthGuard]},
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  {path: 'createRdv', component: RdvCreateComponent, canActivate: [AuthGuard]},
  {path: 'listRdv', component: RdvListComponent, canActivate: [AuthGuard]},
  {path: 'dossier', component: DossierComponent, canActivate: [AuthGuard]},
  {path: 'listDossier', component: DossierListComponent, canActivate: [AuthGuard]}
];
@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ],
  providers: [AuthGuard],
  declarations: []
})

export class AppRoutingModule {

}
