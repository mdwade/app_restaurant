import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { ComptePage } from './compte.page';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';
import {ConnectPageModule} from './connect/connect.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ExploreContainerComponentModule,
    RouterModule.forChild([{path: '', component: ComptePage}]),
    ReactiveFormsModule,
    ConnectPageModule
  ],
  declarations: [ComptePage]
})
export class ComptePageModule {}
