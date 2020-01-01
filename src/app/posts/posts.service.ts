import { Post} from './post.model';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { map} from 'rxjs/operators';
import { Router } from '@angular/router';
import { Dossier } from './dossier.model';

@Injectable({providedIn: 'root'})
export class PostsService {
  private posts: Post[] = [];
  private dossiers: Dossier[] = [];
  private postsUpdated = new Subject<Post[]>();
  private dossierUpdated = new Subject<Dossier[]>();

  constructor(private http: HttpClient, private router: Router) {}

  getPosts() {
    this.http
      .get<{ message: string; posts: any }>(
        'http://localhost:3000/api/posts'
      )
      .pipe(map((postData) => {
        return postData.posts.map(post => {
          return {
            title: post.title,
            content: post.content,
            id: post._id,
            imagePath: post.imagePath,
            creator: post.creator
          };
        });
      }))
      .subscribe(transformedPost => {
        this.posts = transformedPost;
        this.postsUpdated.next([...this.posts]);
      });
  }


  getDossiers() {
    this.http
      .get<{ message: string; dossiers: any }>(
        'http://localhost:3000/api/dossiers'
      )
      .pipe(map((dossierData) => {
        return dossierData.dossiers.map(dossier => {
          return {
            id: dossier._id,
            nomPatient: dossier.nomPatient,
            prenomPatient: dossier.prenomPatient,
            dateNaissance: dossier.dateNaissance,
            adresse: dossier.adresse,
            mutuelle: dossier.mutuelle,
            tel: dossier.tel,
            numAdmission: dossier.numAdmission,
            medecinTraitant: dossier.medecinTraitant,
            medecinResponsable: dossier.medecinResponsable,
            poids: dossier.poids,
            taille: dossier.taille,
            creator: dossier.creator
          };
        });
      }))
      .subscribe(transformedDossier => {
        this.dossiers = transformedDossier;
        this.dossierUpdated.next([...this.dossiers]);
      });
  }

  getPost(id: string) {
    return this.http.get<{
      _id: string;
      title: string;
      content: string;
      imagePath: string;
      creator: string;
    }>('http://localhost:3000/api/posts/' + id);
  }

  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }

  getDossierUpdateListener() {
    return this.dossierUpdated.asObservable();
  }
  addPost(title: string, content: string, image: File) {
    const postData = new FormData();
    postData.append('title', title);
    postData.append('content', content);
    postData.append('image', image, title);
    this.http
    .post<{ message: string; post: Post }>(
      'http://localhost:3000/api/posts',
      postData
    )
    .subscribe(responseData => {
      this.router.navigate(['/']);
    });
  }

  addDossier(nomPatient: string, prenomPatient: string, dateNaissance: string, adresse: string , mutuelle: string, tel: string,
             numAdmission: string, medecinTraitant: string, medecinResponsable: string, poids: string, taille: string ) {
    const dossierData = { nomPatient, prenomPatient, dateNaissance, adresse, mutuelle, tel, numAdmission, medecinTraitant,
      medecinResponsable, poids, taille};
    this.http
    .post<{ message: string; dossier: Dossier }>(
      'http://localhost:3000/api/dossiers',
      dossierData
    )
    .subscribe(responseData => {
      this.router.navigate(['/']);
    });
  }

  getDossier(id: string) {
    return this.http.get<{
      _id: string;
      nomPatient: string;
      prenomPatient: string;
      dateNaissance: string;
      adresse: string;
      mutuelle: string;
      tel: string;
      numAdmission: string;
      medecinTraitant: string;
      medecinResponsable: string;
      poids: string;
      taille: string;
      creator: string;
    }>('http://localhost:3000/api/dossiers/' + id);
  }

  updatePost(id: string, title: string, content: string, image: File | string) {
    let postData: Post | FormData;
    if (typeof image === 'object') {
      postData = new FormData();
      postData.append('id', id);
      postData.append('title', title);
      postData.append('content', content);
      postData.append('image', image, title);
    } else {
      postData = {
        id,
        title,
        content,
        imagePath: image,
        creator: null
      };
    }
    this.http
      .put('http://localhost:3000/api/posts/' + id, postData)
      .subscribe(response => {
        this.router.navigate(['']);
      });
  }

  updateDossier(id: string, nomPatient: string, prenomPatient: string, dateNaissance: string, adresse: string, mutuelle: string,
                tel: string, numAdmission: string, medecinTraitant: string, medecinResponsable: string, poids: string, taille: string) {
    const dossierData = {id, nomPatient, prenomPatient, dateNaissance, adresse, mutuelle, tel, numAdmission, medecinTraitant,
       medecinResponsable, poids, taille, creator: null};
    this.http
      .put('http://localhost:3000/api/dossiers/' + id, dossierData)
      .subscribe(response => {
        this.router.navigate(['/listRdv']);
      });
  }


  deletePost(postId: string) {
    return this.http.delete('http://localhost:3000/api/posts/' + postId);
  }
  deleteDossier(dossierId: string) {
    return this.http.delete('http://localhost:3000/api/dossiers/' + dossierId);
  }
}
