import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { IncriptionPageRoutingModule } from './incription-routing.module';

import { IncriptionPage } from './incription.page';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        IncriptionPageRoutingModule,
        ReactiveFormsModule
    ],
  declarations: [IncriptionPage]
})
export class IncriptionPageModule {}
