import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { API_ENDPOINT_DISLIKE, API_ENDPOINT_SHOWINTEREST } from 'src/app/constant/constant.config';
import { PostDetailsPage } from 'src/app/post-details/post-details.page';
import { CmnServiceService } from 'src/app/Service/cmn-service.service';
import { ServicesWrapperService } from 'src/app/Service/services-wrapper.service';
// import { CallNumber } from '@awesome-cordova-plugins/call-number/ngx';
import { MoreMenuPopoverComponent } from '../more-menu-popover/more-menu-popover.component';

@Component({
  selector: 'app-post-card',
  templateUrl: './post-card.component.html',
  styleUrls: ['./post-card.component.scss'],
})
export class PostCardComponent implements OnInit {
  @Input() detail = {};
  @Input() module = '';
  clickedInterested: boolean;
  constructor(private modalController: ModalController,
    private cmnService: CmnServiceService,
    private serviceWrapper: ServicesWrapperService,
    private cmn: CmnServiceService,
    // private callNumber: CallNumber
  ) { }

  ngOnInit() {
    this.clickedInterested = false;
    
    //console.log("From post card! ", this.module);
  }

  async redirectToDetails() {
    if (this.module == "my-post") {
      const modal = await this.modalController.create({
        component: PostDetailsPage,
        cssClass: 'my-custom-class',
        componentProps: {
          'detail': this.detail
        }
      });
      await modal.present();
    }

  }

  sendInterest() {
    this.clickedInterested = true;
    let showInterestObj = {
      "userid": this.cmnService.getLoggedInUserId(),
      "postid": this.detail["post_id"],
      "token": this.cmnService.getLoginToken()
    };
    this.serviceWrapper.postApi(API_ENDPOINT_SHOWINTEREST, showInterestObj).subscribe((resp: any) => {
      if (resp.status == 1) {
        this.clickedInterested = false;
        this.detail["interest"] = 1;
      }
      // else {
      //   this.cmnService.showError(resp.msg);
      // }
    })

  }

  revokeInterest() {
    this.clickedInterested = true;
    let revokeInterestObj = {
      "userid": this.cmnService.getLoggedInUserId(),
      "postid": this.detail["post_id"],
      "token": this.cmnService.getLoginToken()
    };
    this.serviceWrapper.postApi(API_ENDPOINT_DISLIKE, revokeInterestObj).subscribe((resp: any) => {
      if (resp.status == 1) {
        this.clickedInterested = false;
        this.detail["interest"] = 0;
      }
      // else {
      //   this.cmnService.showError(resp.msg);
      // }
    })
  }

  callPerson(number) {
    // this.callNumber.callNumber(number, false)
    //   .then(res => 
    //     console.log('Launched dialer!'
    //   , res))
    //   .catch(err => 
    //     console.log('Error launching dialer'
    //     , err));
  }

  formatDate(dateObj: any) {
    return dateObj.replace(/-/g, "/");
  }

  async presentInfoPopover4(ev: any) {
    this.cmn.openInfoPopover(ev, "Lady Traveller");
  }

  async presentInfoPopover2(ev: any) {
    this.cmn.openInfoPopover(ev, "This Post is from one of your Friends");
  }

  async presentInfoPopover3(ev: any) {
    this.cmn.openInfoPopover(ev, "List of people interested on your post");
  }

  openMoreMenu(ev,currentObj){
    this.cmnService.openAnyPopover(MoreMenuPopoverComponent, ev, currentObj,"my-posts")
  }

  


}
