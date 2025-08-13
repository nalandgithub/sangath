import { Component, Input, OnInit } from '@angular/core';
// import { CallNumber } from '@awesome-cordova-plugins/call-number/ngx';
import { ModalController } from '@ionic/angular';
import { API_ENDPOINT_GETINTERESTEDLIST } from '../constant/constant.config';
import { CmnServiceService } from '../Service/cmn-service.service';
import { ServicesWrapperService } from '../Service/services-wrapper.service';

@Component({
  selector: 'app-post-details',
  templateUrl: './post-details.page.html',
  styleUrls: ['./post-details.page.scss'],
})
export class PostDetailsPage implements OnInit {
  @Input() detail: any;
  showLoader: boolean = false;
  interestedLists = [];
  constructor(private modalController: ModalController,
    private serviceWrapper: ServicesWrapperService,
    private cmnService: CmnServiceService,
    // private callNumber: CallNumber
  ) { }

  ngOnInit() {
    //console.log("From details ", this.detail);
    this.getListOfInterestedPeople();
  }

  getListOfInterestedPeople() {
    this.showLoader = true;
    let interestOnPostObj = {
      "token": this.cmnService.getLoginToken(),
      "postid": this.detail.post_id
    }
    this.serviceWrapper.postApi(API_ENDPOINT_GETINTERESTEDLIST, interestOnPostObj).subscribe((resp: any) => {
      this.showLoader = false;
      //console.log(resp);
      if (resp.status == 1) {
        this.interestedLists = [];
        this.interestedLists = resp.interestlist2;
        //console.log("Interested List ", this.interestedLists);
      } else {
        // this.cmnService.showError(resp.msg);
      }
    }, err => {
      this.showLoader = false;
    })
  }

  async closeModal() {
    await this.modalController.dismiss().then(res => {
    }).catch(err => {
    });
  }

  callPerson(number) {
  //   this.callNumber.callNumber(number, false)
  //     .then(res => console.log('Launched dialer!', res))
  //     .catch(err => console.log('Error launching dialer', err));
   }

}
