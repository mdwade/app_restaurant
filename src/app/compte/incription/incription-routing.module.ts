import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { IncriptionPage } from './incription.page';

const routes: Routes = [
  {
    path: '',
    component: IncriptionPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class IncriptionPageRoutingModule {}
