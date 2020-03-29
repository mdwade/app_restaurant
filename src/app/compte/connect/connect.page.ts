import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../../services/auth.service';
import {Router} from '@angular/router';
import {TabsPage} from "../../tabs/tabs.page";
import {UserService} from "../../services/user.service";
import {LoadingController} from "@ionic/angular";
import {API_URL} from "../../../environments/environment";

@Component({
  selector: 'app-connect',
  templateUrl: './connect.page.html',
  styleUrls: ['./connect.page.scss'],
})
export class ConnectPage implements OnInit {

  connectForm: FormGroup;
  errorMessage: string;

  constructor(private authService: AuthService,
              private formBuilder: FormBuilder,
              private router: Router,
              private userService: UserService,
              private loading: LoadingController) {
    if (window.localStorage.getItem('token')) {
      this.router.navigate(['/tabs/compte/profil']);
    }
  }

  ngOnInit(): void {
    if (window.localStorage.getItem('token')) {
      this.router.navigate(['/tabs/compte/profil']);
    }
    this.initForm();
  }

  initForm() {
    this.connectForm = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  async onSubmit() {
    const loading = await this.loading.create({
        message: 'Connexion en cours...'
    });
    await loading.present();
    const auth = {
      identifier: this.connectForm.get('email').value,
      password: this.connectForm.get('password').value
    };
    this.authService.connect(auth).subscribe(
        response => {
          // @ts-ignore
          window.localStorage.setItem('role', response.user.role.name);
          // @ts-ignore
          window.localStorage.setItem('token', response.jwt);
          const token = [window.localStorage.getItem('token'), window.localStorage.getItem('role')];
          this.authService.token = token;
          this.authService.emit();
          this.initForm();
          // @ts-ignore
            const user = response.user;
            user.photo = user.photo != null && user.photo.url != undefined ? API_URL + user.photo.url : null;
          this.userService.currentUser = [user];
          this.userService.emitUser();
          loading.dismiss();
          this.router.navigate(['/tabs/menu']);
        },
        error => {
          loading.dismiss();
            this.errorMessage = 'Identifiant ou mot de passe incorrecte';
          // this.errorMessage = error.error.message[0].messages[0].message;
        }
    );
  }

}
