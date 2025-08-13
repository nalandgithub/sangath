import { HttpClient } from "@angular/common/http";
import { Component, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { IonSlides } from "@ionic/angular";
import { API_ENDPOINT_GET_POSTS } from "src/app/constant/constant.config";
import { CmnServiceService } from "src/app/Service/cmn-service.service";
import { ServicesWrapperService } from "src/app/Service/services-wrapper.service";

@Component({
  selector: "app-tab1",
  templateUrl: "tab1.page.html",
  styleUrls: ["tab1.page.scss"],
  providers: [],
})
export class Tab1Page implements OnInit {
  @ViewChild("slides", { static: false }) slides: IonSlides;
  segment = 0;
  allPosts: any[];
  showLoader: boolean;
  constructor(
    private serviceWrapper: ServicesWrapperService,
    private cmnService: CmnServiceService,
    private activatedRoute: ActivatedRoute
  ) {
    this.activatedRoute.queryParams.subscribe((params: any) => {
      //console.log("from notif redirection params tab1", params);
      if (params.segment) {
        this.segment = parseInt(params.segment);
        this.segmentChanged();
      }
    });
  }

  ngOnInit() {
    this.allPosts = [];
  }
  ionViewWillEnter() {
    this.getPosts();
  }

  getPosts() {
    this.showLoader = true;
    let getPostsObj = {
      token: this.cmnService.getLoginToken(),
      option: parseInt(this.segment.toString()) + 1,
      userid: this.cmnService.getLoggedInUserId(),
    };
    this.serviceWrapper
      .postApi(API_ENDPOINT_GET_POSTS, getPostsObj)
      .subscribe((resp: any) => {
        this.showLoader = false;
        if (resp.status == 1) {
          this.allPosts = resp.posts;
          //console.log("All post ", this.allPosts);
        } else {
          // this.cmnService.showError(resp.msg);
        }
      });
  }

  async segmentChanged(ev?: any) {
    //console.log("Segement Click: ", this.segment);
    await this.slides.slideTo(this.segment);
    this.getPosts();
  }

  async slideChanged() {
    //console.log("Slide Change");
    this.segment = await this.slides.getActiveIndex();
    this.getPosts();
  }
  doRefresh(refresh: any) {
    this.getPosts();
    setTimeout(() => {
      refresh.target.complete();
    }, 1000);
  }
}
