import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TabFriendsPageRoutingModule } from './tab-friends-routing.module';

import { TabFriendsPage } from './tab-friends.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TabFriendsPageRoutingModule
  ],
  declarations: [TabFriendsPage]
})
export class TabFriendsPageModule {}
