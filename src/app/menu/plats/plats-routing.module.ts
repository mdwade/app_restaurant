import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PlatsPage } from './plats.page';

const routes: Routes = [
  {
    path: '',
    component: PlatsPage
  },
  {
    path: 'ajouter',
    loadChildren: () => import('./ajouter/ajouter.module').then( m => m.AjouterPageModule)
  },
  {
    path: 'modifier',
    loadChildren: () => import('./modifier/modifier.module').then( m => m.ModifierPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PlatsPageRoutingModule {}
