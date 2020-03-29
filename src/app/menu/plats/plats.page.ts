import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {PlatsService} from '../../services/plats.service';
import {LoadingController, ToastController} from '@ionic/angular';
import Swal from 'sweetalert2';
import {PreviousRouteService} from '../../services/previous-route.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-plats',
  templateUrl: './plats.page.html',
  styleUrls: ['./plats.page.scss'],
})
export class PlatsPage implements OnInit, OnDestroy {

  plats: any[];
  platSubscription: Subscription;
  previousRouteSubscription: Subscription;

  constructor(private platsService: PlatsService,
              private loading: LoadingController,
              private toastController: ToastController,
              private previousRouteService: PreviousRouteService,
              private router: Router) { }

  ngOnInit() {
    this.platsService.getAll();
    this.platSubscription = this.platsService.platSubject.subscribe(
        (plats: any[]) => {
          this.plats = plats;
        }
    );
    this.previousRouteService.setPreviousUrl(this.router.url);
    this.previousRouteSubscription = this.previousRouteService.subject.subscribe();
  }

    async presentToast(text) {
        const toast = await this.toastController.create({
            message: text,
            position: 'bottom',
            duration: 1000
        });
        toast.present();
    }

    async onDelete(id) {
        Swal.fire({
            title: 'Supprimer le plat.',
            text: 'Vous êtes sûr ?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Oui',
            cancelButtonText: 'Non'
        }).then(async (result) => {
            if (result.value) {
                const loading = await this.loading.create({
                    message: 'Suppression...'
                });
                await loading.present();

                this.platsService.delete(id).subscribe(
                    () => {
                        this.platsService.getAll();
                        this.platsService.emit();
                        loading.dismiss();
                        this.presentToast('Plat supprimé');
                    },
                    err => {
                        console.log(err);
                        loading.dismiss();
                        this.presentToast('Erreur. Veuillez réessayer.');
                    }
                );
            }
        });

    }

    ngOnDestroy(): void {
      this.platSubscription.unsubscribe();
      this.previousRouteSubscription.unsubscribe();
    }

}
