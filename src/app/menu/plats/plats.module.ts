import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PlatsPageRoutingModule } from './plats-routing.module';

import { PlatsPage } from './plats.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PlatsPageRoutingModule
  ],
  declarations: [PlatsPage]
})
export class PlatsPageModule {}
