import {Component, OnDestroy, OnInit} from '@angular/core';
import {AuthService} from '../services/auth.service';
import {CommandeService} from '../services/commande.service';
import {Subscription} from 'rxjs';
import {UserService} from '../services/user.service';
import {User} from '../models/user';
import Swal from 'sweetalert2';
import {LoadingController, ToastController} from '@ionic/angular';

@Component({
  selector: 'app-commande',
  templateUrl: 'commande.page.html',
  styleUrls: ['commande.page.scss']
})
export class CommandePage implements OnInit, OnDestroy {

  token = window.localStorage.getItem('token');
  commandeSubscription: Subscription;
  authSubscription: Subscription;
  userSubscription: Subscription;
  authAttribute = [];
  commandes = [];
  user = new User();
  date  = new Date();
  currentDate = this.date.getDate() + '-' + (this.date.getMonth() + 1) + '-' + this.date.getFullYear();
  constructor(private authService: AuthService,
              private commandeService: CommandeService,
              private userService: UserService,
              private loading: LoadingController,
              private toastController: ToastController) {}


  ngOnInit(): void {

    this.authSubscription = this.authService.authSubject.subscribe(
        (token) => {
          this.authAttribute = token;
        }
    );

    this.authService.emit();

    this.commandeService.getAll();

    this.commandeSubscription = this.commandeService.commandeSubsject.subscribe(
        (commandes) => {
          this.commandes = [];
          for (let i = commandes.length - 1 ; i >= 0 ; i--) {
            this.commandes.push(commandes[i]);
          }
        }
    );


    this.commandeService.emit();
    this.userService.token = this.token;
    this.userService.getUser();

    this.userSubscription = this.userService.userSubject.subscribe(
        (user) => {
            this.user = user[0];
        }
    );

    this.userService.emitUser();
  }

    async presentToast(text) {
        const toast = await this.toastController.create({
            message: text,
            position: 'bottom',
            duration: 3000
        });
        toast.present();
    }

    async onRemove(id) {
        Swal.fire({
            title: 'Annuler la commande.',
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
                    message: 'Annulation de la commande.'
                });
                await loading.present();

                this.commandeService.delete(id).subscribe(
                    () => {
                        this.commandeService.getAll();
                        this.commandeService.emit();
                        loading.dismiss();
                        this.presentToast('Commande annulée.');
                    },
                    error => {
                        console.log(error);
                        loading.dismiss();
                        this.presentToast('Erreur. Veuillez réessayer');
                    }
                );
            }
        });

    }

  ngOnDestroy(): void {
    this.authSubscription.unsubscribe();
    this.commandeSubscription.unsubscribe();
    this.userSubscription.unsubscribe();
  }

  getToday() {
      let len = 0;

      for (const cmd of this.commandes) {
          if (this.currentDate == cmd.date_commande) {
              len++;
          }
      }

      return len;
  }

  getUserCmd() {
      let len = 0;

      for (const cmd of this.commandes) {
          if (this.user.id == cmd.user.id) {
              len++;
          }
      }
      return len;
  }

}
