import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { API_ENDPOINT_GET_NOTIFICATIONS } from 'src/app/constant/constant.config';
import { CmnServiceService } from 'src/app/Service/cmn-service.service';
import { ServicesWrapperService } from 'src/app/Service/services-wrapper.service';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss'],
})
export class NotificationsComponent implements OnInit {
notifications:any;
  constructor(
    private navCtrl: NavController,
    private cmnService: CmnServiceService,
    private serviceWrapper: ServicesWrapperService,
    ) { }

  ngOnInit() {
    this.getMyFeedbacks();
  }
  getMyFeedbacks(){
    let myFeedbackObj = {
      "userid":this.cmnService.getLoggedInUserId(),
      "token":this.cmnService.getLoginToken()
    }
    
    this.serviceWrapper.postApi(API_ENDPOINT_GET_NOTIFICATIONS,myFeedbackObj).subscribe((resp:any)=>{
      //console.log("my feedbacks",resp);
      if(resp.status == 1){
        this.notifications = resp.mynotifications;
      }
    })
  }

  doRefresh(refresh: any) {
    this.getMyFeedbacks();
    setTimeout(() => {
      refresh.target.complete();
    }, 1000);
  }

  displayHtml(content){
    return this.cmnService.parseAndDisplayHtml(content);
  }

  onClickNotification(type){
    let redirectUrlBase = "/tabs/tabs/";
    switch(type){
      case "1":
        this.navCtrl.navigateRoot(redirectUrlBase + "tab1", {
          queryParams: { segment: 0 },
        });
        break;
      case "2":
        this.navCtrl.navigateRoot(redirectUrlBase + "tab1", {
          queryParams: { segment: 1 },
        });
        break;
      case "3":
        this.navCtrl.navigateRoot(redirectUrlBase + "tab2", {
          queryParams: { segment: 0 },
        });
        break;
      case "4":
        this.navCtrl.navigateRoot(redirectUrlBase + "tab-friends", {
          queryParams: { segment: 1 },
        });
        break;
      case "5":
        this.navCtrl.navigateRoot(redirectUrlBase + "tab-friends", {
          queryParams: { segment: 0 },
        });
        break;
      case "6":
        this.navCtrl.navigateRoot(redirectUrlBase + "tab1");
        break;
      case "7":
        this.navCtrl.navigateRoot(redirectUrlBase + "tab1");
        break;
      default:
        break;
    }
    
  }

}
