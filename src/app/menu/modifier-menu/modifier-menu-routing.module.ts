import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ModifierMenuPage } from './modifier-menu.page';

const routes: Routes = [
  {
    path: '',
    component: ModifierMenuPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ModifierMenuPageRoutingModule {}
