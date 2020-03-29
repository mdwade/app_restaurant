import {Component, OnDestroy, OnInit} from '@angular/core';
import {PlatsService} from '../../../services/plats.service';
import {ActivatedRoute, Router} from '@angular/router';
import {LoadingController, ToastController} from '@ionic/angular';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Plat} from '../../../models/plat';
import {PreviousRouteService} from '../../../services/previous-route.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-modifier',
  templateUrl: './modifier.page.html',
  styleUrls: ['./modifier.page.scss'],
})
export class ModifierPage implements OnInit, OnDestroy {

  updateForm: FormGroup;
  plat: Plat;
  errorMessage: string;
  previousRouteSubscription: Subscription;
  previousPage = '';

  constructor(private platsService: PlatsService,
              private formBuilder: FormBuilder,
              private route: ActivatedRoute,
              private loading: LoadingController,
              private toastController: ToastController,
              private router: Router,
              private previousRouteService: PreviousRouteService) {
    this.updateForm = this.formBuilder.group({
      nom: ['', Validators.required],
      description: ['', Validators.required],
      prix: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.initForm();
    this.previousRouteSubscription = this.previousRouteService.subject.subscribe();
    this.previousPage = this.previousRouteService.getPreviousUrl();
  }

  async presentToast(text) {
    const toast = await this.toastController.create({
      message: text,
      position: 'bottom',
      duration: 1000
    });
    toast.present();
  }

  initForm() {
    this.plat = new Plat();
    const id = this.route.snapshot.paramMap.get('id');
    this.platsService.get(id).subscribe(
        (data: Plat) => {
          this.plat = data;
          this.updateForm = this.formBuilder.group({
            nom: [this.plat.nom, Validators.required],
            description: [this.plat.description, Validators.required],
            prix: [this.plat.prix, Validators.required]
          });
        },
        err => {
          console.log(err);
        }
    );
  }

  async onSubmit() {
    const loading = await this.loading.create({
      message: 'Modification en cours.'
    });
    await loading.present();

    this.plat.nom = this.updateForm.get('nom').value;
    this.plat.description = this.updateForm.get('description').value;
    this.plat.prix = this.updateForm.get('prix').value;

    this.platsService.update(this.plat).subscribe(
        () => {
          this.platsService.getAll();
          this.platsService.emit();
          loading.dismiss();
          this.presentToast('Modification ok');
          this.router.navigate([this.previousRouteService.getPreviousUrl()]);
        },
        err => {
          console.log(err);
          loading.dismiss();
          this.presentToast('Erreur. Veuillez réessayer.');
        }
    );
  }

  ngOnDestroy(): void {
      this.previousRouteSubscription.unsubscribe();
  }

}
