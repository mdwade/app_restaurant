import { Injectable } from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router} from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {

  constructor(private router: Router) {
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.isConnected();
  }

  isConnected(): boolean {
    if (window.localStorage.getItem('token') && window.localStorage.getItem('role') == 'Admin') {
      return true;
    } else {
      this.router.navigate(['/tabs/compte/connect']);
      return false;
    }
  }
}
