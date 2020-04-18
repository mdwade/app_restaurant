import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../../services/auth.service';
import {Router} from '@angular/router';
import {User} from '../../models/user';
import {LoadingController} from '@ionic/angular';

@Component({
  selector: 'app-incription',
  templateUrl: './incription.page.html',
  styleUrls: ['./incription.page.scss'],
})
export class IncriptionPage implements OnInit {

  signupForm: FormGroup;
  errorMessage: string;

  constructor(private authService: AuthService,
              private formBuilder: FormBuilder,
              private router: Router,
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
    this.signupForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.pattern(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)]],
      password: ['', [Validators.required, Validators.pattern(/[0-9a-zA-Z]{6,}/)]],
      nom: ['', Validators.required],
      prenom: ['', Validators.required],
      telephone: ['', [Validators.required, Validators.pattern(/[7][0678][0-9]{7}/)]],
      adresse: ['', Validators.required],
      username: ['', Validators.required]
    });
  }

  async onSubmit() {
    const loading = await this.loading.create({
      message: 'Création de votre compte...'
    });
    await loading.present();
    const username = this.signupForm.get('username').value;
    const email = this.signupForm.get('email').value;
    const password = this.signupForm.get('password').value;
    const nom = this.signupForm.get('nom').value;
    const prenom = this.signupForm.get('prenom').value;
    const adresse = this.signupForm.get('adresse').value;
    const telephone = this.signupForm.get('telephone').value;
    const user = new User();
    user.username = username;
    user.email = email;
    user.password = password;
    user.nom = nom;
    user.prenom = prenom;
    user.telephone = telephone;
    user.adresse = adresse;
    this.authService.register(user).subscribe(
        response => {
          loading.dismiss();
          this.initForm();
          this.router.navigate(['/tabs/compte/connect']);
        },
        error => {
          loading.dismiss();
          switch (error.error.message[0].messages[0].id) {
            case 'Auth.form.error.email.taken' :
              this.errorMessage = 'Email déjà utilisé';
              break;
            case 'Auth.form.error.username.taken' :
              this.errorMessage = 'Nom utilisateur déjà utilisé';
              break;
            default :
              this.errorMessage = error.error.message[0].messages[0].message;
              break;
          }
        }
    );
  }

}
