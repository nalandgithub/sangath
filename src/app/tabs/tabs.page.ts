import { Component, OnInit } from "@angular/core";
import { NavigationEnd, Router } from "@angular/router";
import {
  ModalController,
  NavController,
  PopoverController,
} from "@ionic/angular";
import { AddPostComponent } from "../add-post/add-post.component";
import {
  API_ENDPOINT_CHECK_TOKEN,
  KEYBOARD_IS_OPEN_INOVKE_KEY,
} from "../constant/constant.config";
import { PostTypePopoverComponent } from "../post-type-popover/post-type-popover.component";
import { CmnServiceService } from "../Service/cmn-service.service";
import { ServicesWrapperService } from "../Service/services-wrapper.service";
// import { AuthService } from '../shared-components/auth-service/auth.service.ts';
import { MenuController } from "@ionic/angular";

@Component({
  selector: "app-tabs",
  templateUrl: "tabs.page.html",
  styleUrls: ["tabs.page.scss"],
})
export class TabsPage implements OnInit {
  showAddPost = false;
  showQue = false;
  authToken: string;
  showLoader: boolean;
  isHideFABButton: boolean = false;

  constructor(
    private cmnService: CmnServiceService,
    private popoverService: PopoverController,
    private navCtrl: NavController,
    private serviceWrapper: ServicesWrapperService,
    private menu: MenuController
  ) {}
  ionViewWillEnter() {}
  ngOnInit(): void {
    this.cmnService.invokeEvent.subscribe((value) => {
      //console.log("invoke event", value);
      this.manageFabButtonVisibility(value);
    });
    //console.log("From tabs");
    if (!this.cmnService.getLoginToken()) this.navCtrl.navigateRoot("/login");
    else {
      this.checkLoginToken();
    }
  }
  manageFabButtonVisibility(value) {
    //console.log("from manageFabButtonVisibility");
    this.isHideFABButton = value === KEYBOARD_IS_OPEN_INOVKE_KEY ? true : false;
    //console.log("isHideFABButton",this.isHideFABButton);
  }
  checkLoginToken() {
    //console.log("Check token");
    this.showLoader = true;
    let checkToken = {
      token: this.cmnService.getLoginToken(),
    };
    this.serviceWrapper
      .postApi(API_ENDPOINT_CHECK_TOKEN, checkToken)
      .subscribe((resp: any) => {
        //console.log("Check token resp", resp);
        if (resp.status == 0) {
          localStorage.removeItem("login-token");
          this.navCtrl.navigateRoot("/login");
        }
        this.showLoader = false;
      });
  }
  openSideMenu() {
    this.menu.enable(true, "side-menu");
    this.menu.open("side-menu");
  }

  async askPostTypeOption(ev) {
    const popoverObj = await this.popoverService.create({
      component: PostTypePopoverComponent,
      cssClass: "post-type-popover popover-opacity",

      event: ev,
      translucent: true,
      mode: "ios",
      componentProps: {
        onClick: () => {
          popoverObj.dismiss();
        },
      },
    });
    popoverObj.present();
  }
}
