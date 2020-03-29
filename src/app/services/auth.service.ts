import { Injectable } from '@angular/core';
import { API_URL} from '../../environments/environment';
import {User} from '../models/user';
import {HttpClient} from '@angular/common/http';
import {Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  API_AUTH_URL = API_URL + '/auth/local';
  token = [window.localStorage.getItem('token'), window.localStorage.getItem('role')];
  authSubject = new Subject<any[]>();

  private auth: { identifier: string; password: string };
  constructor(private httpClient: HttpClient) { }

  emit() {
    this.authSubject.next(this.token.slice());
  }

  register(user: User) {
    return this.httpClient.post<User>(this.API_AUTH_URL + '/register', user).pipe();
  }

  connect(user: any) {
    return this.httpClient.post<User>(this.API_AUTH_URL, user).pipe();
  }

}
