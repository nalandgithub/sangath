import { Component, OnInit } from '@angular/core';
import { API_ENDPOINT_POST_ADD_IMAGE,API_ENDPOINT_POST_UPLOADED_IMAGE} from 'src/app/constant/constant.config';
import { CmnServiceService } from 'src/app/Service/cmn-service.service';
import { ServicesWrapperService } from 'src/app/Service/services-wrapper.service';

@Component({
  selector: 'upload-image',
  templateUrl: './upload-image.component.html',
  styleUrls: ['./upload-image.component.scss'],
})
export class UploadImageComponent implements OnInit {
img:any;
image:any;
currentFile:any;
  constructor(
    private cmnService: CmnServiceService,
    private serviceWrapper: ServicesWrapperService) { }

  ngOnInit() {
    this.getuploadedimage();
  }

  getuploadedimage(){
    let usersObj = {
      "token": this.cmnService.getLoginToken()
    }
    this.serviceWrapper.postApi(API_ENDPOINT_POST_UPLOADED_IMAGE,usersObj).subscribe((resp:any)=>{
      
      if(resp.status == 1){
        this.image = resp.image;
      }
    })
  }
  onFileSelect(ev){
    //console.log("File to be uploaded",ev.target.files[0]);
    this.currentFile = ev.target.files[0];
    var reader = new FileReader();
    reader.onload = function(){
      document.getElementById('previewImage').setAttribute("src",reader.result.toString());
      // output = reader.result;
    };
    reader.readAsDataURL(this.currentFile);
  }
  submitImage(){
    let addFeedbackObj = {
      // "token": this.cmnService.getLoginToken(),
      "image": this.currentFile,
    }
    this.serviceWrapper.postApi(API_ENDPOINT_POST_ADD_IMAGE, addFeedbackObj,this.currentFile).subscribe((resp: any) => {
      //console.log("Add Image", resp);
      if (resp.status == 1) {
        this.img = null;
        this.cmnService.showSuccess(resp.msg);
        //this.getMyFeedbacks();
      }
    })
  }

}
