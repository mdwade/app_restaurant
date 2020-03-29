import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {PlatsService} from '../../../services/plats.service';
import {Router} from '@angular/router';
import {Plat} from '../../../models/plat';
import {LoadingController, ToastController} from '@ionic/angular';
import {Subscription} from 'rxjs';
import {PreviousRouteService} from '../../../services/previous-route.service';

@Component({
  selector: 'app-ajouter',
  templateUrl: './ajouter.page.html',
  styleUrls: ['./ajouter.page.scss'],
})
export class AjouterPage implements OnInit, OnDestroy {

  addForm: FormGroup;
  errorMessage: string;
  previousRouteSubscription: Subscription;
  previousPage = '';

  constructor(private formBuilder: FormBuilder,
              private platsService: PlatsService,
              private router: Router,
              private loading: LoadingController,
              private toastController: ToastController,
              private previousRouteService: PreviousRouteService) { }

  ngOnInit() {
    this.initForm();
    this.previousRouteSubscription = this.previousRouteService.subject.subscribe();
    this.previousPage = this.previousRouteService.getPreviousUrl();
  }

  initForm() {
    this.addForm = this.formBuilder.group({
      nom: ['', Validators.required],
      description: ['', Validators.required],
      prix: ['', Validators.required]
    });
  }

  async presentToast(text) {
    const toast = await this.toastController.create({
      message: text,
      position: 'bottom',
      duration: 1000
    });
    toast.present();
  }

  async onSubmit() {
    const plat = new Plat();
    plat.nom = this.addForm.get('nom').value;
    plat.description = this.addForm.get('description').value;
    plat.prix = this.addForm.get('prix').value;

    const loading = await this.loading.create({
      message: 'Ajout en cours...'
    });

    await loading.present();

    this.platsService.add(plat).subscribe(
        () => {
          this.platsService.getAll();
          this.platsService.emit();
          loading.dismiss();
          this.presentToast('Plat ajouté.');
          this.router.navigate([this.previousPage]);
        },
        err => {
          loading.dismiss();
          this.presentToast('Erreur. Veuillez réessayer.');
          console.log(err);
        }
    );
  }

  ngOnDestroy(): void {
    this.previousRouteSubscription.unsubscribe();
  }

}
