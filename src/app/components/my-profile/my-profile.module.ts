import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MyProfilePage } from './my-profile.page';

import { MyProfilePageRoutingModule } from './my-profile-routing.module';
import { AccordionPageModule } from 'src/app/shared-components/accordion/accordion.module';

import { Ng2SearchPipeModule } from 'ng2-search-filter';
@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    RouterModule.forChild([{ path: '', component: MyProfilePage }]),
    MyProfilePageRoutingModule,
    AccordionPageModule,
    Ng2SearchPipeModule,
  ],
  declarations: [MyProfilePage],
  exports: [MyProfilePage]
})
export class MyProfilePageModule { }
