import {Component, Injectable, OnDestroy, OnInit} from '@angular/core';
import {UserService} from '../../services/user.service';
import {Router} from '@angular/router';
import Swal from 'sweetalert2';
import {Camera, CameraOptions, PictureSourceType} from '@ionic-native/camera/ngx';
import {ActionSheetController, LoadingController, ToastController} from '@ionic/angular';
import {Subscription} from 'rxjs';
import { File, FileEntry } from '@ionic-native/file/ngx';
import {AuthService} from '../../services/auth.service';
import {User} from '../../models/user';
import {API_URL} from '../../../environments/environment';


@Injectable({
    providedIn: 'root'
})
@Component({
  selector: 'app-profil',
  templateUrl: './profil.page.html',
  styleUrls: ['./profil.page.scss'],
})
export class ProfilPage implements OnInit, OnDestroy {

  token = window.localStorage.getItem('token');
  currentUer = new User();
  userSubscription: Subscription;

  constructor(private userService: UserService,
              private authService: AuthService,
              private router: Router,
              private camera: Camera,
              private actionSheetController: ActionSheetController,
              private toastController: ToastController,
              private file: File,
              private loadingController: LoadingController) {
  }

  async ngOnInit() {
      this.userService.token = this.token;
      const loading = await this.loadingController.create({
          message: 'Initialisation...'
      });
      loading.present();

      this.userService.getUser();
      this.userSubscription = this.userService.userSubject.subscribe(
          (user) => {
              this.currentUer = user[0];
          }
      );

      loading.dismiss();
      this.userService.emitUser();
  }

  ngOnDestroy(): void {
      this.userSubscription.unsubscribe();
  }

    onSignOut() {
      Swal.fire({
        title: 'Deconnexion',
        text: 'Voulez-vous vous deconnecter ?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Oui',
        cancelButtonText: 'Annuler'
      }).then((result) => {
          if (result.value) {
              window.localStorage.clear();
              this.userService.revokeUser();
              this.authService.token = [];
              this.authService.emit();
              this.router.navigate(['/tabs/compte/connect']);
          }
      });
    }

    async presentToast(text) {
        const toast = await this.toastController.create({
            message: text,
            position: 'bottom',
            duration: 3000
        });
        toast.present();
    }

    async onUpdatePic() {
        const actionSheet = await this.actionSheetController.create({
           header: 'Selectionner une image',
           buttons: [
               {
                   text: 'Ouvrir gallerie',
                   handler: () => {
                        this.takePicture(this.camera.PictureSourceType.PHOTOLIBRARY);
                   }
               },
               {
                   text: 'Prendre une photo',
                   handler: () => {
                       this.takePicture(this.camera.PictureSourceType.CAMERA);
                   }
               },
               {
                   text: 'Annuler',
                   role: 'cancel'
               }
           ]
        });
        await actionSheet.present();
    }

    takePicture(source: PictureSourceType) {
        const options: CameraOptions = {
            quality: 50,
            correctOrientation: true,
            sourceType: source,
            destinationType: this.camera.DestinationType.FILE_URI,
            mediaType: this.camera.MediaType.PICTURE

        };
        this.camera.getPicture(options).then(imageData => {
            this.startUpload(imageData);
        }, (err) => {
            // Handle error
            console.log('Camera issue: ' + err);
        });
    }

    startUpload(imgEntry) {
        this.file.resolveLocalFilesystemUrl(imgEntry)
            .then(entry => {
                ( entry as FileEntry).file(file => this.readFile(file));
            })
            .catch(err => {
                console.log(err);
                this.presentToast('Erreur. Veuillez réessayer.');
            });
    }

    readFile(file: any) {
        const reader = new FileReader();
        reader.onload = () => {
            const formData = new FormData();
            const imgBlob = new Blob([reader.result], {
                type: file.type
            });
            formData.append('files', imgBlob, file.name);
            this.uploadImageData(formData);
        };
        reader.readAsArrayBuffer(file);
    }

    async uploadImageData(formData: FormData) {
        const loading = await this.loadingController.create({
            message: 'Chargement de l\'image...',
        });
        await loading.present();
        this.userService.uploadFile(formData).subscribe(
            response => {
                const user = this.currentUer;
                user.photo = response[0];
                this.userService.updateProfilePic(user).subscribe(
                    (data) => {
                      this.userService.getUser();
                      this.userService.emitUser();
                      this.presentToast('Photo de profil mise à jour');
                      window.location.reload();
                    },
                (err) => {
                        console.log(err);
                        this.presentToast('Erreur. Veuillez réessayer.');
                }
                );
                loading.dismiss();
            },
            err => {
                console.log(err);
                loading.dismiss();
                this.presentToast('Erreur. Veuillez réessayer.');
            }
        );
    }

}
