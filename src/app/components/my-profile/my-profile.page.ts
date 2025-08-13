import { Component, OnInit } from "@angular/core";
import { CmnServiceService } from "src/app/Service/cmn-service.service";
import { ServicesWrapperService } from "src/app/Service/services-wrapper.service";
import { Clipboard } from "@awesome-cordova-plugins/clipboard/ngx";
import { AlertController } from "@ionic/angular";
import {
  API_ENDPOINT_ADD_FRIEND,
  API_ENDPOINT_GET_LINK,
  API_ENDPOINT_GET_USER,
  API_ENDPOINT_GET_USER_PROFILE,
} from "src/app/constant/constant.config";

@Component({
  selector: "my-profile",
  templateUrl: "my-profile.page.html",
  styleUrls: ["my-profile.page.scss"],
})
export class MyProfilePage implements OnInit {
  userlist: any;
  currentUserId: any;
  show: boolean = false;
  showLoader = false;
  user: any;
  userProfileData: any;
  alertObj: any;
  isSendRequestClicked: boolean = false;
  userModel: any;
  constructor(
    private serviceWrapper: ServicesWrapperService,
    private cmn: CmnServiceService,
    private clipboard: Clipboard,
    private alertCtrl: AlertController
  ) { }

  ngOnInit() {
    // this.user = JSON.parse(localStorage.getItem('login-details'));
    // this.getPageData();
    // if (this.user.status == 1){
    this.getUserDetails();
    this.getUserList();
    // }
    // else
    //   this.cmn.showError("Please login again!");
  }

  getUserDetails() {
    // this.userProfileData = this.user.data[0];
    this.serviceWrapper
      .postApi(API_ENDPOINT_GET_USER_PROFILE, {
        token: this.cmn.getLoginToken(),
      })
      .subscribe((resp: any) => {
        //console.log("getUserDetails", resp);
        this.userProfileData = resp.user[0];

        // To set default value as My ID;
        this.userModel = this.userProfileData?.user_id;
      });
    //console.log(this.userProfileData);
  }
  copyText(textToCopy) {
    this.clipboard.copy(textToCopy);
    this.cmn.showThemeBasedToast("Text Copied Successfully!");
  }

  getUserList() {
    //console.log("getUserList");
    this.serviceWrapper.postApi(API_ENDPOINT_GET_USER, {
      userid: this.cmn.getLoggedInUserId(),
    }).subscribe((resp: any) => {
      if (resp.status == 1) {
        //console.log("getUserList result", resp);
        this.userlist = resp.userlist;
      }
    });
  }

  async onClickGenerateLink() {
    if (!(this.currentUserId)) {
      this.currentUserId = this.userProfileData.user_id
    }
    this.showLoader = true;
    let generateLinkObj = {
      token: this.cmn.getLoginToken(),
      userid: this.currentUserId,
    };
    this.serviceWrapper
      .postApi(API_ENDPOINT_GET_LINK, generateLinkObj)
      .subscribe((resp: any) => {
        //console.log("generate link success!", resp);
        this.showLoader = false;
        if (resp.status == 1) {
          this.openGeneratedLinkAlert(resp.link);
        } else {
          this.cmn.showError(resp.msg);
        }
      });
  }

  async openGeneratedLinkAlert(linkToDisplay) {
    const alertObj = await this.alertCtrl.create({
      header: "Copy below link to ",
      cssClass: "link-generate-alert",
      message: "<a>" + linkToDisplay + "</a>",
      buttons: [
        {
          text: "Ok",
          role: "cancel",
        },
        {
          text: "Copy",
          handler: () => {
            //console.log("Copy clicked!");
            this.copyText(linkToDisplay);
            return false;
          },
        },
      ],
    });
    await alertObj.present();
  }

  async presentAlertPrompt() {
    this.alertObj = await this.alertCtrl.create({
      cssClass: "bg-white",
      header: "Add Friend",
      mode: "ios",
      inputs: [
        {
          name: "sangathIdTxt",
          type: "number",
          placeholder: "Enter Friend's Sangath ID",
        },
      ],
      buttons: [
        {
          text: "Send Request",
          handler: (alertData) => {
            //console.log(alertData.sangathIdTxt);
            if (alertData.sangathIdTxt)
              this.sendFriendRequest(alertData.sangathIdTxt);
            else
              this.cmn.showError("Please enter valid SangathId.");
            return false;
          },
        },
        {
          text: "Cancel",
          role: "cancel",
          cssClass: "secondary",
          handler: () => { },
        },
      ],
    });

    await this.alertObj.present();
  }

  sendFriendRequest(sangathId) {
    // this.showLoader = true;
    this.cmn.showLoader();
    let addFrndObj = {
      token: this.cmn.getLoginToken(),
      userid: this.cmn.getLoggedInUserId(),
      sangathid: sangathId,
    };
    this.serviceWrapper
      .postApi(API_ENDPOINT_ADD_FRIEND, addFrndObj)
      .subscribe((resp: any) => {
        // this.showLoader = false;
        //console.log("Add friend method");
        this.cmn.hideLoader();
        if (resp.status == 1) {
          this.alertObj.dismiss();
          this.cmn.showSuccess(resp.msg);
          return true;
        } else {
          // this.cmn.showError(resp.msg);
          return false;
        }
      });
  }

  async presentInfoPopover(ev: any) {
    this.cmn.openInfoPopover(
      ev,
      "Enter other person's Sangath-ID to add him as a friend"
    );
  }
  onSelectPlan(ev) {
    //console.log(ev);
    this.currentUserId = ev.detail.value;
  }
}
