import {Injectable, OnDestroy, OnInit} from '@angular/core';
import {Subject, Subscription} from 'rxjs';
import {AuthService} from './auth.service';
import {HttpClient} from '@angular/common/http';
import {API_URL} from '../../environments/environment';
import {UserService} from './user.service';
import {Commande} from '../models/commande';

@Injectable({
  providedIn: 'root'
})
export class CommandeService implements OnInit, OnDestroy {

  authSubscription: Subscription;
  token = window.localStorage.getItem('token');
  API_COMMANE_URL = API_URL + '/commandes';
  commandes = [];
  commandeSubsject = new Subject<any[]>();

  constructor(private authService: AuthService,
              private httpClient: HttpClient,
              private userService: UserService) { }

  ngOnInit(): void {
    this.authSubscription = this.authService.authSubject.subscribe(
        (token) => {
          this.token = token[0];
          console.log(token);
        }
    );

    this.authService.emit();
  }

  ngOnDestroy(): void {
    this.authSubscription.unsubscribe();
  }

  emit() {
    this.commandeSubsject.next(this.commandes.slice());
  }

  getAll() {
    this.httpClient.get<any>(this.API_COMMANE_URL, {
      headers: {
        Authorization: `Bearer ${this.token}`,
      },
    }).subscribe(
        (data) => {
          this.commandes = data;
          this.emit();
        },
        err => {
          console.log(err);
        }
    );
  }

  add(commande) {
      return this.httpClient.post(this.API_COMMANE_URL, commande, {
          headers: {
              Authorization: `Bearer ${this.token}`,
          },
      }).pipe();
  }

  delete(id) {
      return this.httpClient.delete(this.API_COMMANE_URL + '/' + id, {
          headers: {
              Authorization: `Bearer ${this.token}`,
          },
      }).pipe();
  }

}
