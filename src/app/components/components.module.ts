import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PostsComponent } from './posts/posts.component';
import { PostCardComponent } from './post-card/post-card.component';
import { SettingsComponent } from './settings/settings.component';
import { FeedbacksComponent } from './feedbacks/feedbacks.component';
import { SubscriptionsComponent } from './subscriptions/subscriptions.component';
import { IonicRatingComponentModule } from 'ionic-rating-component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ContactUsComponent } from '../contact-us/contact-us.component';
import { FaqtncComponent } from './faqtnc/faqtnc.component';
import { HistoryComponent } from './history/history.component';
import { MoreMenuPopoverComponent } from './more-menu-popover/more-menu-popover.component';
import { MiAccordionComponent } from './widgets/mi-accordion/mi-accordion.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { AddMemberComponent } from './add-member/add-member.component';
import { UploadImageComponent } from './upload-image/upload-image.component';


@NgModule({
  declarations: [PostsComponent, PostCardComponent, SettingsComponent, FeedbacksComponent, SubscriptionsComponent,
    ContactUsComponent,FaqtncComponent,HistoryComponent,MoreMenuPopoverComponent,MiAccordionComponent,NotificationsComponent,AddMemberComponent,UploadImageComponent],
  imports: [
    CommonModule,
    IonicRatingComponentModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [
    PostsComponent, PostCardComponent, SettingsComponent, FeedbacksComponent, SubscriptionsComponent,
    ContactUsComponent,FaqtncComponent, HistoryComponent,NotificationsComponent,AddMemberComponent,UploadImageComponent
  ]
})
export class ComponentsModule { }
