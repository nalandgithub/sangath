import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController, NavController,MenuController, AlertController } from '@ionic/angular';
import { AddPostComponent } from '../add-post/add-post.component';
import { POST_TYPE_TRAVELLEE, POST_TYPE_TRAVELLER,API_ENDPOINT_ADD_FRIEND } from '../constant/constant.config';
import { CmnServiceService } from '../Service/cmn-service.service';
import { ServicesWrapperService } from '../Service/services-wrapper.service';

@Component({
  selector: 'app-post-type-popover',
  templateUrl: './post-type-popover.component.html',
  styleUrls: ['./post-type-popover.component.scss'],
})
export class PostTypePopoverComponent implements OnInit {
  @Input()
  public onClick = () => { }
  travelleeConst: any;
  travellerConst: any;
  alertObj:any;
  // alertCtrl:any;
  constructor(
    private modal: ModalController,
    private navCtrl: NavController,
    private router: Router,
    private menuCtrl: MenuController,
    private cmnservice: CmnServiceService,
    private servicesWrapper: ServicesWrapperService,
    private alertCtrl:AlertController
  ) { }

  ngOnInit() {
    this.travelleeConst = POST_TYPE_TRAVELLEE;
    this.travellerConst = POST_TYPE_TRAVELLER;
  }


  async openAddPost(postType) {
    const modal = await this.modal.create({
      component: AddPostComponent,
      componentProps: { "postType": postType },
      cssClass: 'my-custom-class',
    });

    modal.onDidDismiss().then((result: any) => {
      this.onClick();
      if (result.data == 'added') {
        //console.log("Current route", this.router.url);
        this.navCtrl.navigateRoot("tabs/tabs/tab2");
      }
      //console.log('After add post', result);

    });
    return await modal.present();
  }

  async presentAlertPrompt() {
    let isTextBoxEmpty = true;
    this.alertObj = await this.alertCtrl.create({
      cssClass: 'bg-white',
      header: 'Add Friend',
      mode: 'ios',
      inputs: [
        {
          name: 'sangathIdTxt',
          type: 'number',
          placeholder: "Enter Friend's Sangath ID"
        }
      ],
      buttons: [
        {
          text: 'Send Request',
          handler: (alertData) => {
            if(alertData.sangathIdTxt){
              this.sendFriendRequest(alertData.sangathIdTxt);
            }else{
              this.cmnservice.showError("Please enter valid Sangath Id.");
            }
            return false;
          }
        }, {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
          }
        }
      ]
    });

    await this.alertObj.present();
  }

  sendFriendRequest(sangathId) {
    // this.showLoader = true;
    this.cmnservice.showLoader();
    let addFrndObj = {
      "token": this.cmnservice.getLoginToken(),
      "userid": this.cmnservice.getLoggedInUserId(),
      "sangathid": sangathId
    }
    this.servicesWrapper.postApi(API_ENDPOINT_ADD_FRIEND, addFrndObj).subscribe((resp: any) => {
      // this.showLoader = false;
      this.cmnservice.hideLoader();
      if (resp.status == 1) {
        this.alertObj.dismiss();
        this.menuCtrl.toggle();
        this.cmnservice.showSuccess(resp.msg);
        return true;
      }
      else {
        return false;
      }
    })
  }

}
