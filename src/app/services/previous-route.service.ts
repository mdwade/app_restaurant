import { Injectable } from '@angular/core';
import {NavigationEnd, Router} from "@angular/router";
import {Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class PreviousRouteService {

  private previousUrl = '';
  subject = new Subject();

  constructor(private router: Router) {
  }

  emit() {
    this.subject.next(this.previousUrl.slice());
  }

  setPreviousUrl(url) {
    this.previousUrl = url;
    this.emit();
  }

  public getPreviousUrl() {
    return this.previousUrl;
  }


}
