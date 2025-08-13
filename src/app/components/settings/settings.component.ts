import { Component, OnInit } from '@angular/core';
import { AlertController, NavController } from '@ionic/angular';
import { API_ENDPOINT_UPDATE_NOTIFY, API_ENDPOINT_NOTIFY ,API_ENDPOINT_UPDATE_IMAGE,API_ENDPOINT_IMAGE_STATUS,API_ENDPOINT_DEACTIVATE} from 'src/app/constant/constant.config';
import { CmnServiceService } from 'src/app/Service/cmn-service.service';
import { ServicesWrapperService } from 'src/app/Service/services-wrapper.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent implements OnInit {
  showLoader = false;
  isCheck : boolean;
  isCheck1 : boolean;
  loggedInUser:any;
  alertObj: any;
  menuCtrl: any;
  constructor(private cmn: CmnServiceService,private serviceWrapper:ServicesWrapperService,private alertCtrl: AlertController,private navCtrl: NavController,) { }

  ngOnInit() {
    this.loggedInUser = JSON.parse(localStorage.getItem('login-details'));
    let notify = {
    "token": this.cmn.getLoginToken(),
    "userid": this.cmn.getLoggedInUserId() 
  }
  let img = {
    "token": this.cmn.getLoginToken()
  }
  this.serviceWrapper.postApi(API_ENDPOINT_NOTIFY, notify).subscribe((res: any) => {
    if (res.notification == 1) {
      this.isCheck= true;
    }
    else {
      this.isCheck= false;
    }
  })
  this.serviceWrapper.postApi(API_ENDPOINT_IMAGE_STATUS, img).subscribe((res: any) => {
    if (res.imgstatus == 1) {
      this.isCheck1= true;
    }
    else {
      this.isCheck1= false;
    }
  })
}

deactivateuser() {
  // this.showLoader = true;
  this.cmn.showLoader();
  let deactivateObj = {
    token: this.cmn.getLoginToken(),
    userid: this.cmn.getLoggedInUserId()
  };
  this.serviceWrapper
    .postApi(API_ENDPOINT_DEACTIVATE, deactivateObj)
    .subscribe((resp: any) => {
      // this.showLoader = false;
      //this.cmn.hideLoader();
      if (resp.status == 1) {
        this.alertObj.dismiss();
        this.cmn.hideLoader();
        localStorage.removeItem("login-token");
        this.navCtrl.navigateRoot("/login");
        this.cmn.showSuccess(resp.msg);
        return true;
      } else {
        this.cmn.hideLoader();
        return false;
      }
    });
}


async presentAlertPrompt() {
  this.alertObj = await this.alertCtrl.create({
    cssClass: "bg-white",
    header: "Do you really want to deactivate your account?",
    mode: "ios",
    
    buttons: [
      {
        text: "Deactivate",
        handler: (alertData) => {
          //console.log(alertData.sangathIdTxt);
          this.deactivateuser();
          return false;
        },
      },
      {
        text: "Cancel",
        role: "cancel",
        cssClass: "secondary",
        handler: () => {},
      },
    ],
  });

  await this.alertObj.present();
}

  


  onChange1($event){
    let selectedOption1 = $event.detail.checked == true?1:0;
    this.showLoader = true;
    let imgupdate = {
      "option1": selectedOption1
    }
    this.serviceWrapper.postApi(API_ENDPOINT_UPDATE_IMAGE, imgupdate).subscribe((resp: any) => {
      this.showLoader = false;
      if (resp.status == 1) {
        this.cmn.showSuccess('Preference Updated Successfully');
      }
      else {
        this.cmn.showError(resp.msg);
      }
    })
  }
  onChange($event){
    let selectedOption = $event.detail.checked == true?1:0;
    this.showLoader = true;
    let notifyupdate = {
      "option": selectedOption,
      "userid": this.cmn.getLoggedInUserId()    
    }
    this.serviceWrapper.postApi(API_ENDPOINT_UPDATE_NOTIFY, notifyupdate).subscribe((resp: any) => {
      this.showLoader = false;
      if (resp.status == 1) {
        this.cmn.showSuccess('Preference Updated Successfully');
      }
      else {
        this.cmn.showError(resp.msg);
      }
    })
  }

}
