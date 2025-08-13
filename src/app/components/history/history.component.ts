import { Component, OnInit } from '@angular/core';
import { API_ENDPOINT_GET_MY_POSTS, API_ENDPOINT_GET_MY_POSTS_HISTORY, DELETE_POST_EVENT_INVOKE_KEY } from 'src/app/constant/constant.config';
import { CmnServiceService } from 'src/app/Service/cmn-service.service';
import { ServicesWrapperService } from 'src/app/Service/services-wrapper.service';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss'],
})
export class HistoryComponent implements OnInit {
  showLoader:any;
  allPosts:any;
  constructor(private cmnService: CmnServiceService,
    private serviceWrapper: ServicesWrapperService) { 
      this.cmnService.invokeEvent.subscribe(value => {
        //console.log("invoke event", value);
        if (value === DELETE_POST_EVENT_INVOKE_KEY) {
          this.getMyPosts();
        }
      });
    }

  ngOnInit() {
    this.getMyPosts();
  }
  getMyPosts() {
    this.showLoader = true;
    let myPostObj = {
      "token": this.cmnService.getLoginToken(),
      "userid": this.cmnService.getLoggedInUserId()
    };
    this.serviceWrapper.postApi(API_ENDPOINT_GET_MY_POSTS_HISTORY + "/2", myPostObj).subscribe((resp: any) => {
      //console.log("my post", resp);
      this.showLoader = false;
      if (resp.status == 1) {
        this.allPosts = resp.posts;
      }
    })
  }

}
