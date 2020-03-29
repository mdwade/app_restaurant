import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {UserService} from '../../../services/user.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {User} from '../../../models/user';
import {LoadingController, ToastController} from '@ionic/angular';

@Component({
  selector: 'app-modifier',
  templateUrl: './modifier.page.html',
  styleUrls: ['./modifier.page.scss'],
})
export class ModifierPage implements OnInit {

  updateForm: FormGroup;
  errorMessage: string;
  user: User;
  constructor(private route: ActivatedRoute,
              private userService: UserService,
              private formBuilder: FormBuilder,
              private router: Router,
              private loading: LoadingController,
              private toastController: ToastController) {
    this.updateForm = this.formBuilder.group({
      nom: ['', Validators.required],
      prenom: ['', Validators.required],
      telephone: ['', [Validators.required, Validators.pattern(/[7][0678][0-9]{7}/)]],
      adresse: ['', Validators.required]
    });
    this.user = new User();
  }

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    const id = this.route.snapshot.paramMap.get('id');

    this.userService.getUserById(id).subscribe(
        (user) => {
          this.user = user;
          this.updateForm = this.formBuilder.group({
            nom: [user.nom, Validators.required],
            prenom: [user.prenom, Validators.required],
            telephone: [user.telephone, [Validators.required, Validators.pattern(/[7][0678][0-9]{7}/)]],
            adresse: [user.adresse, Validators.required]
          });
        }
    );
  }

  async presentToast(text) {
    const toast = await this.toastController.create({
      message: text,
      position: 'top',
      duration: 3000
    });
    toast.present();
  }

  async onSubmit() {
    const loading = await this.loading.create({
      message: 'Mise à jour'
    });
    await loading.present();

    this.user.prenom = this.updateForm.get('prenom').value;
    this.user.nom = this.updateForm.get('nom').value;
    this.user.telephone = this.updateForm.get('telephone').value;
    this.user.adresse = this.updateForm.get('adresse').value;

    this.userService.updateProfilePic(this.user).subscribe(
        () => {
          this.userService.getUser();
          this.userService.emitUser();
          loading.dismiss();
          this.presentToast('Votre profile a été mis à jour');
          window.location.replace('/tabs/compte/profil');
        },
        err => {
          console.log(err);
          loading.dismiss();
          this.presentToast('Une erreur est survenue');
        }
    );

  }

}
