import { Component, OnInit } from "@angular/core";
import { AlertController } from "@ionic/angular";
import {
  API_ENDPOINT_ADD_FEEDBACK,
  API_ENDPOINT_GET_FEEDBACKS,
} from "src/app/constant/constant.config";
import { CmnServiceService } from "src/app/Service/cmn-service.service";
import { ServicesWrapperService } from "src/app/Service/services-wrapper.service";

@Component({
  selector: "app-feedbacks",
  templateUrl: "./feedbacks.component.html",
  styleUrls: ["./feedbacks.component.scss"],
})
export class FeedbacksComponent implements OnInit {
  feedback: any;
  feedbacks: any;
  alertObj: any;
  constructor(
    private cmnService: CmnServiceService,
    private serviceWrapper: ServicesWrapperService,
    private alertCtrl: AlertController
  ) {}

  ngOnInit() {
    this.getMyFeedbacks();
  }

  onRatingChange(rating) {
    //console.log("Rating changed", rating);
  }

  submitFeedback(feedbackData: any) {
    let addFeedbackObj = {
      token: this.cmnService.getLoginToken(),
      userid: this.cmnService.getLoggedInUserId(),
      feedback: feedbackData,
      stars: 0,
    };
    this.serviceWrapper
      .postApi(API_ENDPOINT_ADD_FEEDBACK, addFeedbackObj)
      .subscribe((resp: any) => {
        //console.log("Add Feedback", resp);
        if (resp.status == 1) {
          this.feedback = "";
          this.alertObj.dismiss();
          this.cmnService.showSuccess(resp.msg);
          this.getMyFeedbacks();
        }
      });
  }

  getMyFeedbacks() {
    let myFeedbackObj = {
      userid: this.cmnService.getLoggedInUserId(),
      token: this.cmnService.getLoginToken(),
    };
    this.serviceWrapper
      .postApi(API_ENDPOINT_GET_FEEDBACKS, myFeedbackObj)
      .subscribe((resp: any) => {
        //console.log("my feedbacks",resp);
        if (resp.status == 1) {
          this.feedbacks = resp.myfeedback;
        }
      });
  }

  async openAddFeedbackModal() {
    this.alertObj = await this.alertCtrl.create({
      cssClass: "bg-white",
      header: "Add Feedback",
      mode: "ios",
      inputs: [
        {
          name: "feedbackModel",
          type: "text",
          placeholder: "Enter your feedback",
        },
      ],
      buttons: [
        {
          text: "Add Feedback",
          handler: (alertData) => {
            //console.log(alertData.sangathIdTxt);
            if (alertData.feedbackModel)
              this.submitFeedback(alertData.feedbackModel);
            else this.cmnService.showError("Please enter feedback");
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
}
