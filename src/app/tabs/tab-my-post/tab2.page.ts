import { Component, OnInit, ViewChild } from '@angular/core';
import { API_ENDPOINT_GET_MY_POSTS, DELETE_POST_EVENT_INVOKE_KEY } from 'src/app/constant/constant.config';
import { IonSlides } from '@ionic/angular';
import { CmnServiceService } from 'src/app/Service/cmn-service.service';
import { ServicesWrapperService } from 'src/app/Service/services-wrapper.service';
@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  providers: [],
})
export class Tab2Page implements OnInit {
  @ViewChild('slides', { static: false }) slides: IonSlides;
  allPosts: any[];
  showLoader: boolean;
  segment = 0;
  constructor(
    private cmnService: CmnServiceService,
    private serviceWrapper: ServicesWrapperService
  ) { 
    this.cmnService.invokeEvent.subscribe(value => {
      //console.log("invoke event", value);
      if (value === DELETE_POST_EVENT_INVOKE_KEY) {
        this.getMyPosts();
      }
    });
  }
  ngOnInit() {
    // this.user = JSON.parse();
    this.showLoader = false;
  }
  ionViewWillEnter() {
    this.getMyPosts();
  }

  getMyPosts() {
    this.showLoader = true;
    let myPostObj = {
      "token": this.cmnService.getLoginToken(),
      "userid": this.cmnService.getLoggedInUserId()
    };
    this.serviceWrapper.postApi(API_ENDPOINT_GET_MY_POSTS + "/1", myPostObj).subscribe((resp: any) => {
      //console.log("my post", resp);
      this.showLoader = false;
      if (resp.status == 1) {
        this.allPosts = resp.posts;
      }
    })
  }
  async segmentChanged(ev: any) {
    //console.log("Segement Click: ", this.segment);
    await this.slides.slideTo(this.segment);
    this.getMyPosts();
  }

  doRefresh(refresh: any) {
    this.getMyPosts();
    setTimeout(() => {
      refresh.target.complete();
    }, 1000);
  }

  async slideChanged(){
    //console.log("Slide Change");
    this.segment = await this.slides.getActiveIndex();
  }
}
