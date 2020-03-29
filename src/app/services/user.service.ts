import {Injectable, OnDestroy, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {API_URL} from '../../environments/environment';
import {Observable, Subject, Subscription} from 'rxjs';
import {User} from '../models/user';
import {AuthService} from "./auth.service";
import {LoadingController} from "@ionic/angular";
declare var $: any;

@Injectable({
  providedIn: 'root'
})
export class UserService implements OnInit, OnDestroy{

  user = new User();
  currentUser = [];
  userSubject = new Subject<any[]>();
  token = window.localStorage.getItem('token');
  authSubscription: Subscription;


  API_USER_URL = API_URL + '/users' ;

  constructor(private httpClient: HttpClient,
              private authService: AuthService,
              private loading: LoadingController) {
  }

  ngOnInit(): void {
    this.authSubscription = this.authService.authSubject.subscribe(
        (token) => {
          this.token = token[0];
        }
    );

    this.authService.emit();
  }

  ngOnDestroy(): void {
    this.authSubscription.unsubscribe();
  }

  emitUser() {
    this.userSubject.next(this.currentUser.slice());
  }

  getUser(){
    this.httpClient.get<User>(this.API_USER_URL + '/me', {
      headers: {
        Authorization: `Bearer ${this.token}`,
      },
    }).subscribe(
        (user) => {
          this.user = user;
          this.httpClient.get<any>(this.API_USER_URL + '/' + user.id, {
            headers: {
              Authorization: `Bearer ${this.token}`,
            },
          }).subscribe(
              (data) => {
                this.user.photo = data.photo != null && data.photo.url != undefined ? API_URL + data.photo.url : null;
                // console.log(this.user);
                this.currentUser = [this.user];
                this.emitUser();
              },
              error => {
                console.log(error);
              }
          );
        }
    );
  }

  uploadFile(formData: FormData): Observable<any> {
    return this.httpClient.post<any>(API_URL + '/upload', formData, {
      headers: {
        Authorization: `Bearer ${this.token}`,
      },
    }).pipe();
  }

  getUserById(id): Observable<any> {
    return this.httpClient.get<any>(this.API_USER_URL + '/' + id, {
      headers: {
        Authorization: `Bearer ${this.token}`,
      },
    }).pipe();
  }

  updateProfilePic(user: User): Observable<any> {
    return this.httpClient.put(this.API_USER_URL + '/' + user.id, user, {
      headers: {
        Authorization: `Bearer ${this.token}`,
      },
    }).pipe();
  }

  revokeUser() {
    this.currentUser[0] = new User();
    this.emitUser();
  }

}
