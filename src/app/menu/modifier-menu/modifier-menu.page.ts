import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {MenuService} from '../../services/menu.service';
import {PlatsService} from '../../services/plats.service';
import {LoadingController, ToastController} from '@ionic/angular';
import Swal from 'sweetalert2';
import {PreviousRouteService} from '../../services/previous-route.service';
import {Router} from '@angular/router';
import {Menu} from '../../models/menu';

@Component({
  selector: 'app-modifier-menu',
  templateUrl: './modifier-menu.page.html',
  styleUrls: ['./modifier-menu.page.scss'],
})
export class ModifierMenuPage implements OnInit, OnDestroy {

  menu_du_jour: any[];
  menuSubscription: Subscription;
  plats: any[];
  platSubscription: Subscription;
  previousRouteSubscription: Subscription;

  constructor(private menuService: MenuService,
              private platsService: PlatsService,
              private loading: LoadingController,
              private toastController: ToastController,
              private previousRouteService: PreviousRouteService,
              private router: Router) { }

  ngOnInit() {
    this.menuService.token = window.localStorage.getItem('token');
    this.menuService.getMenuDuJour();
    this.menuSubscription = this.menuService.menuSubject.subscribe(
        (menu: any[]) => {
          this.menu_du_jour = menu;
        }
    );
    this.platsService.getAll();
    this.platSubscription = this.platsService.platSubject.subscribe(
        (plats: any[]) => {
          this.plats = plats;
        }
    );

    this.previousRouteService.setPreviousUrl(this.router.url);

    this.previousRouteSubscription = this.previousRouteService.subject.subscribe();
  }

  inMenu(id) {
    for (const plat of this.menu_du_jour) {

      if (plat.id == id) {
        return true;
      }
    }

    return false;
  }

  async presentToast(text) {
    const toast = await this.toastController.create({
      message: text,
      position: 'bottom',
      duration: 3000
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
              this.menuService.getMenuDuJour();
              this.menuService.emit();
              this.platsService.getAll();
              this.platsService.emit();
              loading.dismiss();
              this.presentToast('Plat supprimé.');
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

  onUpdatePlat(id) {
    this.router.navigate(['/tabs/menu/plats/modifier/' + id]);
  }

  onAdd(plat) {
    this.menu_du_jour.push(plat);
    this.updateMenu(this.menu_du_jour);
  }

  onRemove(id) {
    for (let i = 0; i < this.menu_du_jour.length; i++) {
      if (this.menu_du_jour[i].id == id) {
        this.menu_du_jour.splice(i, 1);
        break;
      }
    }
    this.updateMenu(this.menu_du_jour);
  }

  async updateMenu(plats) {
    const loading = await this.loading.create({
      message: 'Mise à jour du menu en cours'
    });
    await loading.present();

    const menu = new Menu();
    menu.id = 1;
    const obj = {
      id: 1,
      plats
    };
    menu.menu_du_jour = [obj];

    this.menuService.update(menu).subscribe(
        () => {
          this.menuService.getMenuDuJour();
          this.menuService.emit();
          loading.dismiss();
          this.presentToast('Mis à jour ok.');
        },
        err => {
          console.log(err);
          loading.dismiss();
          this.presentToast('Erreur. Veuillez réessayer.');
        }
    );
  }

  ngOnDestroy(): void {
    this.menuSubscription.unsubscribe();
    this.platSubscription.unsubscribe();
    this.previousRouteSubscription.unsubscribe();
  }

}
