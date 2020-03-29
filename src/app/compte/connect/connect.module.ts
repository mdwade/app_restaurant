import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ConnectPageRoutingModule } from './connect-routing.module';

import { ConnectPage } from './connect.page';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        ConnectPageRoutingModule,
        ReactiveFormsModule
    ],
    exports: [
        ConnectPage
    ],
    declarations: [ConnectPage]
})
export class ConnectPageModule {}
