import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { Tab4PageRoutingModule } from './tab4-routing.module';

import { Tab4Page } from './tab4.page';
import { IonicSelectableModule } from 'ionic-selectable';
import { MyProfilePageModule } from 'src/app/components/my-profile/my-profile.module';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    Tab4PageRoutingModule,
    IonicSelectableModule,
    MyProfilePageModule,
    ComponentsModule
  ],
  declarations: [Tab4Page]
})
export class Tab4PageModule { }
