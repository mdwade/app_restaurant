import {Injectable, OnDestroy, OnInit} from '@angular/core';
import {API_URL} from "../../environments/environment";
import {Observable, Subject, Subscription} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {Plat} from "../models/plat";
import {AuthService} from "./auth.service";

@Injectable({
  providedIn: 'root'
})
export class PlatsService implements OnInit, OnDestroy {

  plats = [];
  API_PLAT_URL = API_URL + '/plats';
  platSubject = new Subject<any[]>();
  token = window.localStorage.getItem('token');
  authSubscription: Subscription;

  constructor(private httpClient: HttpClient,
              private authService: AuthService) { }

  emit() {
    this.platSubject.next(this.plats.slice());
  }

    ngOnInit(): void {
        this.authSubscription = this.authService.authSubject.subscribe(
            token => {
                this.token = token[0];
            }
        );

        this.authService.emit();
    }

    ngOnDestroy(): void {
        this.authSubscription.unsubscribe();
    }

  getAll() {
    this.httpClient.get<any[]>(this.API_PLAT_URL).subscribe(
        (data) => {
          this.plats = data;
          this.emit();
        },
        (err) => {
          console.log(err);
        }
    );
  }

    add(plat: Plat): Observable<Plat> {
        return this.httpClient.post<Plat>(this.API_PLAT_URL, plat, {
            headers: {
                Authorization: `Bearer ${this.token}`,
            },
        }).pipe();
    }

    delete(id: number): Observable<Plat> {
        return this.httpClient.delete<Plat>(this.API_PLAT_URL + '/' + id, {
            headers: {
                Authorization: `Bearer ${this.token}`,
            },
        }).pipe();
    }

    update(plat: Plat): Observable<Plat> {
        return this.httpClient.put<Plat>(this.API_PLAT_URL + '/' + plat.id, plat, {
            headers: {
                Authorization: `Bearer ${this.token}`,
            },
        }).pipe();
    }

    get(id): Observable<Plat> {
        return this.httpClient.get<Plat>(this.API_PLAT_URL + '/' + id, {
            headers: {
                Authorization: `Bearer ${this.token}`,
            },
        }).pipe();
    }

}
