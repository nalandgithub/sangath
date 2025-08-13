import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'tab1',
        loadChildren: () => import('./tab-home/tab1.module').then(m => m.Tab1PageModule)
      },
      {
        path: 'tab2',
        loadChildren: () => import('./tab-my-post/tab2.module').then(m => m.Tab2PageModule)
      },
      // {
      //   path: 'tab3',
      //   loadChildren: () => import('./tab-profile/tab3.module').then(m => m.Tab3PageModule)
      // },
      {
        path: 'tab-friends',
        loadChildren: () => import('./tab-friends/tab-friends.module').then(m => m.TabFriendsPageModule)
      },
      {
        path: 'tab4',
        loadChildren: () => import('./tab-more/tab4.module').then(m => m.Tab4PageModule)
      },
      {
        path: '',
        redirectTo: '/tabs/tab1',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: 'tabs/tab1',
    pathMatch: 'full'
  },
  {
    path: 'post-detail',
    loadChildren: () => import('../post-details/post-details.module').then(m => m.PostDetailsPageModule)
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class TabsPageRoutingModule { }
