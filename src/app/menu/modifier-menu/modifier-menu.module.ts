import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ModifierMenuPageRoutingModule } from './modifier-menu-routing.module';

import { ModifierMenuPage } from './modifier-menu.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ModifierMenuPageRoutingModule
  ],
  declarations: [ModifierMenuPage]
})
export class ModifierMenuPageModule {}
