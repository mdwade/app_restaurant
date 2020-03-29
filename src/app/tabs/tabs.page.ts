import {Component, OnDestroy, OnInit} from '@angular/core';
import {AuthService} from '../services/auth.service';
import {Subscription} from 'rxjs';
import {Router} from '@angular/router';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage implements OnInit, OnDestroy {

  token = null;
  authSubscription: Subscription;
  constructor(private authService: AuthService) {
  }

  ngOnInit(): void {
    this.authSubscription = this.authService.authSubject.subscribe(
        response => {
          this.token = response[0];
        }
    );
    this.authService.emit();

  }

  ngOnDestroy(): void {
    this.authSubscription.unsubscribe();
  }

}
