import {Injectable, OnDestroy, OnInit} from '@angular/core';
import {API_URL} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Subject, Subscription} from "rxjs";
import {AuthService} from "./auth.service";

@Injectable({
  providedIn: 'root'
})
export class MenuService implements OnInit, OnDestroy{

  API_MENU_URL = API_URL + '/menus' ;
  menuDuJour = [];
  menuSubject = new Subject<any[]>();
  token = window.localStorage.getItem('token');
  authSubscription: Subscription;

  constructor(private httpClient: HttpClient,
              private authService: AuthService) { }

  emit() {
    this.menuSubject.next(this.menuDuJour.slice());
  }

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

    getMenuDuJour() {
    this.httpClient.get<any[]>(this.API_MENU_URL).subscribe(
        response => {
          this.menuDuJour = response[0].menu_du_jour[0].plats;
          this.emit();
        },
        err => {
          console.log(err)
        }
    );
  }

  update(menu: any) {
      return this.httpClient.put(this.API_MENU_URL + '/' + menu.id, menu, {
          headers: {
              Authorization: `Bearer ${this.token}`,
          },
      }).pipe();
  }

}
