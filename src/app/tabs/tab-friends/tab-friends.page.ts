import { Component, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { IonSlides } from "@ionic/angular";
import { MoreMenuPopoverComponent } from "src/app/components/more-menu-popover/more-menu-popover.component";
import {
  API_ENDPOINT_CANCEL_REQUEST,
  API_ENDPOINT_FRIEND_LIST,
  API_ENDPOINT_REQUEST,
  DELETE_FRIEND_EVENT_INVOKE_KEY,
} from "src/app/constant/constant.config";
import { CmnServiceService } from "src/app/Service/cmn-service.service";
import { ServicesWrapperService } from "src/app/Service/services-wrapper.service";

@Component({
  selector: "app-tab-friends",
  templateUrl: "./tab-friends.page.html",
  styleUrls: ["./tab-friends.page.scss"],
})
export class TabFriendsPage implements OnInit {
  @ViewChild("slides", { static: false }) slides: IonSlides;
  showLoader: any;
  segment = 0;
  pendingFrnds: any[];
  friends: any[];
  friendRequestStatus: any;
  friendRequestStatusId: any;
  constructor(
    private serviceWrapper: ServicesWrapperService,
    private cmnService: CmnServiceService,
    private activatedRoute: ActivatedRoute
  ) {
    this.activatedRoute.queryParams.subscribe((params: any) => {
      //console.log("from notif redirection params friends", params);
      if (params.segment) {
        this.segment = params.segment;
        this.segmentChanged();
      }
    });
    this.cmnService.invokeEvent.subscribe((value) => {
      //console.log("invoke event", value);
      if (value === DELETE_FRIEND_EVENT_INVOKE_KEY) {
        this.getFriends();
      }
    });
  }

  ngOnInit() {
    this.friendRequestStatus = "";
    this.pendingFrnds = [];
    this.friends = [];
    // this.getFriends();
  }
  ionViewWillEnter() {
    //console.log("Friends ionViewWillEnter");
    this.getFriends();
  }

  async segmentChanged(ev?: any) {
    //console.log("Segement Click: ", this.segment);
    await this.slides.slideTo(this.segment);
    // this.getFriends();
  }

  async slideChanged() {
    //console.log("Slide Change");
    this.segment = await this.slides.getActiveIndex();
  }

  getFriends() {
    // this.showLoader = true;
    let friendListObj = {
      token: this.cmnService.getLoginToken(),
      userid: this.cmnService.getLoggedInUserId(),
    };
    this.serviceWrapper
      .postApi(API_ENDPOINT_FRIEND_LIST, friendListObj)
      .subscribe((resp: any) => {
        //console.log("Friends", resp);
        // this.showLoader = false;
        if (resp.status == 1) {
          resp.Requests.map(function (ele) {
            return (ele.tempStatus = "");
          });
          this.pendingFrnds = resp.Requests;
          this.friends = resp.Friends;
          //console.log(this.pendingFrnds);
        }
        // else {
        //   this.cmnService.showError(resp.msg);
        // }
      });
  }

  friendRequestAction(friendObj, mode) {
    let frndObj = {
      token: this.cmnService.getLoginToken(),
      userid: this.cmnService.getLoggedInUserId(),
      status: mode == "A" ? 1 : 2,
      friendid: friendObj.friend_id,
    };
    friendObj.tempStatus = "I";
    this.serviceWrapper
      .postApi(API_ENDPOINT_REQUEST, frndObj)
      .subscribe((resp: any) => {
        if (resp.status == 1) {
          this.friendRequestStatus = mode;
          this.friendRequestStatusId = friendObj.friend_id;
          //console.log("friend req action", resp);
          friendObj.tempStatus = mode;
        } else {
          friendObj.tempStatus = "";
          // this.cmnService.showError(resp.msg);
        }
      });
  }

  onCancelRequest(frndObj) {
    let currentIndex = this.pendingFrnds.indexOf(frndObj);
    //console.log(currentIndex);
    let cancelReqObj = {
      token: this.cmnService.getLoginToken(),
      userid: this.cmnService.getLoggedInUserId(),
      friendid: frndObj.friend_id,
    };
    this.serviceWrapper
      .postApi(API_ENDPOINT_CANCEL_REQUEST, cancelReqObj)
      .subscribe((resp: any) => {
        if (resp.status == 1) {
          this.pendingFrnds.splice(currentIndex, 1);
        } else {
          // this.cmnService.showError(resp.msg);
        }
      });
  }

  openMoreMenu(ev: any, currentFrndObj: any) {
    this.cmnService.openAnyPopover(
      MoreMenuPopoverComponent,
      ev,
      currentFrndObj,
      "my-friends"
    );
  }
  doRefresh(refresh: any) {
    this.getFriends();
    setTimeout(() => {
      refresh.target.complete();
    }, 1000);
  }
}
