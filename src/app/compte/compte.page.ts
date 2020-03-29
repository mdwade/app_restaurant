import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {AuthService} from '../services/auth.service';

@Component({
  selector: 'app-compte',
  templateUrl: 'compte.page.html',
  styleUrls: ['compte.page.scss']
})
export class ComptePage implements OnInit{


  constructor(private router: Router,
              private authService: AuthService) {
    if (window.localStorage.getItem('token')) {
      this.router.navigate(['/tabs/compte/profil']);
    } else {
      this.router.navigate(['/tabs/compte/connect']);
    }
  }

  ngOnInit(): void {
    this.authService.emit();
    if (window.localStorage.getItem('token')) {
      this.router.navigate(['/tabs/compte/profil']);
    } else {
      this.router.navigate(['/tabs/compte/connect']);
    }
  }
}
