import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { API_ENDPOINT_GET_MY_SUBSCRIPTIONS, API_ENDPOINT_GET_SUBSCRIPTIONS, API_ENDPOINT_POST_SUB_PLAN } from 'src/app/constant/constant.config';
import { CmnServiceService } from 'src/app/Service/cmn-service.service';
import { ServicesWrapperService } from 'src/app/Service/services-wrapper.service';

@Component({
  selector: 'app-subscriptions',
  templateUrl: './subscriptions.component.html',
  styleUrls: ['./subscriptions.component.scss'],
})
export class SubscriptionsComponent implements OnInit {
  subscriptions: any;
  mySubscriptions: any;
  customActionSheetOptions: any = {
    header: 'Sangaath Subscriptions',
    subHeader: 'Select any subscription plan from below'
  };
  
  currentSelectSubPlan: any;
  constructor(
    private cmnService: CmnServiceService,
    private serviceWrapper: ServicesWrapperService,
    private alertController: AlertController,
    private cmn: CmnServiceService
  ) { }

  ngOnInit() {
    this.getMySubscriptions();
    this.getSubscriptionList();
    
  }

  getMySubscriptions() {
    console.log("getMySubscriptions");
    let mySubObj = {
      "token": this.cmnService.getLoginToken(),
      "userid": this.cmnService.getLoggedInUserId()
    }
    this.serviceWrapper.postApi(API_ENDPOINT_GET_MY_SUBSCRIPTIONS, mySubObj).subscribe((resp: any) => {
      if (resp.status == 1) {
        //console.log("getMySubscriptions result", resp);
        this.mySubscriptions = resp.subs;
      }
    });
  }
  getSubscriptionList() {
    //console.log("getSubscriptionList");
    this.serviceWrapper.getApi(API_ENDPOINT_GET_SUBSCRIPTIONS).subscribe((resp: any) => {
      if (resp.status == 1) {
        //console.log("getSubscriptions result", resp);
        this.subscriptions = resp.subslist;
      }
    });
  }

  async openActivateSubscription() {
    const alert = await this.alertController.create({
      cssClass: 'subscription-plan-confirmation-alert',
      header: 'Confirm!',
      message: 'Please pay relevant amount to activate subscription at Sangaath portal',
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
            // this.removeFrndApi();
            this.activateSubscription(this.currentSelectSubPlan);
          }
        }
      ]
    });

    await alert.present();
  }

  activateSubscription(planId) {
    let subPlanObj = {
      "token": this.cmnService.getLoginToken(),
      "userid": this.cmnService.getLoggedInUserId(),
      "planid": planId
    }
    this.serviceWrapper.postApi(API_ENDPOINT_POST_SUB_PLAN, subPlanObj).subscribe((resp: any) => {
      if (resp.status == 1) {
        //console.log("activateSubscription result", resp);
        this.cmnService.showSuccess(resp.msg);
        this.getMySubscriptions();
      }
    });
  }

  async presentInfoPopover4(ev: any) {
    this.cmn.openInfoPopover(ev, "Select any subscription plan and make the payment to the given account information");
  }


  onSelectPlan(ev) {
    //console.log(ev);
    this.currentSelectSubPlan = ev.detail.value;
    // alert("test");
  }
}
