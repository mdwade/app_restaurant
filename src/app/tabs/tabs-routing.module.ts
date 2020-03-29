import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';
import {AuthGuard} from '../guard/auth.guard';
import {AdminGuard} from '../guard/admin.guard';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'compte',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../compte/connect/connect.module').then(m => m.ConnectPageModule)
          },
          {
            path: 'connect',
            loadChildren: () =>
                import('../compte/connect/connect.module').then(m => m.ConnectPageModule)
          },
          {
            path: 'inscription',
            children: [
              {
                path: '',
                loadChildren: () =>
                    import('../compte/incription/incription.module').then(m => m.IncriptionPageModule)
              }
            ]
          },
          {
            path: 'profil',
            canActivate: [AuthGuard],
            children: [
              {
                path: '',
                loadChildren: () =>
                    import('../compte/profil/profil.module').then(m => m.ProfilPageModule)
              },
              {
                path: 'modifier/:id',
                loadChildren: () =>
                    import('../compte/profil/modifier/modifier.module').then(m => m.ModifierPageModule)
              }
            ]
          }
        ]
      },
      {
        path: 'menu',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../menu/menu.module').then(m => m.MenuPageModule)
          },
          {
            path: 'plats',
            canActivate: [AdminGuard],
            children: [
              {
                path: '',
                loadChildren: () => import('../menu/plats/plats.module').then( m => m.PlatsPageModule)
              },
              {
                path: 'ajouter',
                loadChildren: () => import('../menu/plats/ajouter/ajouter.module').then(m => m.AjouterPageModule)
              },
              {
                path: 'modifier/:id',
                loadChildren: () => import('../menu/plats/modifier/modifier.module').then(m => m.ModifierPageModule)
              }
            ]
          },
          {
            path: 'modifier-menu',
            canActivate: [AdminGuard],
            loadChildren: () => import('../menu/modifier-menu/modifier-menu.module').then( m => m.ModifierMenuPageModule)
          }
        ]
      },
      {
        path: 'commande',
        canActivate: [AuthGuard],
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../commande/commande.module').then(m => m.CommandePageModule)
          }
        ]
      },
      {
        path: '',
        redirectTo: '/tabs/compte',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/tabs/compte',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabsPageRoutingModule {}
