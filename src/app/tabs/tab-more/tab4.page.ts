import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { API_ENDPOINT_DONATION } from 'src/app/constant/constant.config';
import { ServicesWrapperService } from 'src/app/Service/services-wrapper.service';
@Component({
  selector: 'app-tab4',
  templateUrl: './tab4.page.html',
  styleUrls: ['./tab4.page.scss'],
})
export class Tab4Page implements OnInit {
  user: any;
  showLoader: any;
  pageData: any;
  currentModule: any;
  constructor(
    private serviceWrapper: ServicesWrapperService,
    private route: ActivatedRoute
  ) {
    this.route.queryParams.subscribe(params => {
      this.currentModule = params.module;
      //console.log("Current Module ", this.currentModule);
    });
  }

  ngOnInit() {
    // this.getDonationData();
  }

  // getDonationData() {
  //   this.showLoader = true;
  //   this.serviceWrapper.getApi(API_ENDPOINT_DONATION).subscribe((resp: any) => {
  //     if (resp.status == 1) {
  //       this.pageData = resp.donation[0];
  //     }
  //     this.showLoader = false;
  //   })
  // }

}
