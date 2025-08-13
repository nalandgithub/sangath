import { Component, OnInit } from '@angular/core';
import { AlertController, NavController, NavParams } from '@ionic/angular';
import { API_ENDPOINT_DELETE_FRIEND, API_ENDPOINT_DELETE_POST, DELETE_FRIEND_EVENT_INVOKE_KEY, DELETE_POST_EVENT_INVOKE_KEY,API_ENDPOINT_INACTIVATE_POST } from 'src/app/constant/constant.config';
import { CmnServiceService } from 'src/app/Service/cmn-service.service';
import { ServicesWrapperService } from 'src/app/Service/services-wrapper.service';

@Component({
  selector: 'app-more-menu-popover',
  templateUrl: './more-menu-popover.component.html',
  styleUrls: ['./more-menu-popover.component.scss'],
})
export class MoreMenuPopoverComponent implements OnInit {
  compPropObj: any;
  moduleName:any;
  constructor(
    private cmnService: CmnServiceService,
    private serviceWrapper: ServicesWrapperService,
    private navParams: NavParams,
    private alertController: AlertController
  ) {
    this.compPropObj = this.navParams.get("componentProps");
    this.moduleName = this.navParams.get("moduleName");
    //console.log("compPropObj", this.compPropObj);
  }

  ngOnInit() { }

  async removeFriend() {
    this.cmnService.closePopover("friend-deleted");
    const alert = await this.alertController.create({
      cssClass: 'delete-confirmation-alert',
      
      header: 'Confirm!',
      message: 'Are you sure you want to remove this friend?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          // id: 'cancel-button',
          handler: (blah) => {
            //console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Ok',
          // id: 'confirm-button',
          handler: () => {
            //console.log('Confirm Okay');
            this.removeFrndApi();
          }
        }
      ]
    });

    await alert.present();
  }

  private removeFrndApi() {
    let deleteReqObj = {
      "token": this.cmnService.getLoginToken(),
      "friendid": this.compPropObj?.friend_id
    }
    this.serviceWrapper.postApi(API_ENDPOINT_DELETE_FRIEND, deleteReqObj).subscribe((resp: any) => {
      //console.log("removeFriend", resp);
      if (resp.status == 1) {
        this.cmnService.callAnotherComponentMehthod(DELETE_FRIEND_EVENT_INVOKE_KEY);
      }
    });
  }

  async deletePost(){
    this.cmnService.closePopover("post-deleted");
    const alert = await this.alertController.create({
      cssClass: 'delete-confirmation-alert',
      
      header: 'Confirm!',
      message: 'Are you sure you want to delete this post?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          // id: 'cancel-button',
          handler: (blah) => {
            //console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Ok',
          // id: 'confirm-button',
          handler: () => {
            //console.log('Confirm Okay');
            this.deletePostApi();
          }
        }
      ]
    });

    await alert.present();
  }

  async inactivatePost(){
    this.cmnService.closePopover("post-deleted");
    const alert = await this.alertController.create({
      cssClass: 'delete-confirmation-alert',
      
      header: 'Confirm!',
      message: 'Are you sure you want to deactivate this post?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          // id: 'cancel-button',
          handler: (blah) => {
            //console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Ok',
          // id: 'confirm-button',
          handler: () => {
            //console.log('Confirm Okay');
            this.inactivatePostApi();
          }
        }
      ]
    });

    await alert.present();
  }

  deletePostApi(){
    let deleteReqObj = {
      "token": this.cmnService.getLoginToken(),
      "postid": this.compPropObj?.post_id,
      "userid":this.cmnService.getLoggedInUserId()
    }
    //console.log("deleteReqObj",deleteReqObj);
    this.serviceWrapper.postApi(API_ENDPOINT_DELETE_POST, deleteReqObj).subscribe((resp: any) => {
      //console.log("deletePost", resp);
      if (resp.status == 1) {
        this.cmnService.callAnotherComponentMehthod(DELETE_POST_EVENT_INVOKE_KEY);
      }
    });
  }

  inactivatePostApi(){
    let inactivateReqObj = {
      "token": this.cmnService.getLoginToken(),
      "postid": this.compPropObj?.post_id,
      "userid":this.cmnService.getLoggedInUserId()
    }
    //console.log("deleteReqObj",inactivateReqObj);
    this.serviceWrapper.postApi(API_ENDPOINT_INACTIVATE_POST, inactivateReqObj).subscribe((resp: any) => {
      //console.log("deletePost", resp);
      if (resp.status == 1) {
        this.cmnService.callAnotherComponentMehthod(DELETE_POST_EVENT_INVOKE_KEY);
      }
    });
  }

}
