import {Component, OnDestroy, OnInit} from '@angular/core';
import {Menu} from '../models/menu';
import {MenuService} from '../services/menu.service';
import {Subscription} from 'rxjs';
import {AuthService} from '../services/auth.service';
import {CommandeService} from '../services/commande.service';
import {LoadingController, ToastController} from '@ionic/angular';
import {Commande} from '../models/commande';
import {UserService} from '../services/user.service';
import {User} from '../models/user';

@Component({
  selector: 'app-menu',
  templateUrl: 'menu.page.html',
  styleUrls: ['menu.page.scss']
})
export class MenuPage implements OnInit, OnDestroy {

  menu_du_jour: any[];
  menuSubscription: Subscription;
  authSubscription: Subscription;
  userSubscription: Subscription;
  user = new User();
  token = window.localStorage.getItem('token');
  role = window.localStorage.getItem('role');
  constructor(private menuService: MenuService,
              private authService: AuthService,
              private userService: UserService,
              private commandeService: CommandeService,
              private loading: LoadingController,
              private toastController: ToastController) {

  }

  async presentToast(text) {
    const toast = await this.toastController.create({
      message: text,
      position: 'bottom',
      duration: 1000
    });
    toast.present();
  }

  ngOnInit(): void {
    this.menuService.getMenuDuJour();
    this.menuSubscription = this.menuService.menuSubject.subscribe(
        (menu: any[]) => {
          this.menu_du_jour = menu;
        }
    );
    this.authSubscription = this.authService.authSubject.subscribe(
        response => {
          this.token = response[0];
          this.role = response[1];
        }
    );

    this.userService.getUser();

    this.userSubscription = this.userService.userSubject.subscribe(
          (user) => {
              this.user = user[0];
          }
      );

    this.userService.emitUser();
  }

  async onCommande(plat) {
    const loading = await this.loading.create({
      message: 'Commande en cours...'
    });
    await loading.present();

    const commande = new Commande();
    commande.plat = plat;
    commande.user = this.user;
    const date = new Date();
    commande.date_commande = date.getDate() + '-' + (date.getMonth() + 1) + '-' + date.getFullYear();
    this.commandeService.add(commande).subscribe(
          () => {
              loading.dismiss();
              this.commandeService.getAll();
              this.commandeService.emit();
              this.presentToast('Commande effectuée');
          },
          error => {
              console.log(error);
              loading.dismiss();
              this.presentToast('Erreur. Veuillez réessayer.');
          }
      );
  }

  ngOnDestroy(): void {
    this.menuSubscription.unsubscribe();
    this.authSubscription.unsubscribe();
    this.userSubscription.unsubscribe();
  }

}
