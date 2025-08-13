import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalController, NavParams, ToastController } from '@ionic/angular';
import { API_ENDPOINT_CITY_LIST, API_ENDPOINT_POST_TRAVELLER } from '../constant/constant.config';
import { CmnServiceService } from '../Service/cmn-service.service';
import { ServicesWrapperService } from '../Service/services-wrapper.service';
// import { AuthService } from '../shared-components/auth-service/auth.service.ts';

@Component({
  selector: 'app-add-post',
  templateUrl: './add-post.component.html',
  styleUrls: ['./add-post.component.scss'],
})
export class AddPostComponent implements OnInit {
  showLoader = false;
  postType: any;
  postFG: FormGroup;
  cities: any;
  visibilities: any[];
  travelTime: any[];

  constructor(
    private cmnService: CmnServiceService,
    private modal: ModalController,
    private toast: ToastController,
    public navParams: NavParams,
    // private authService: AuthService,
    private serviceWrapper: ServicesWrapperService
  ) {
    this.postType = this.navParams.get('postType');
    //console.log("Post type", this.postType);
    this.postFG = new FormGroup({
      token: new FormControl(this.cmnService.getLoginToken()),
      userid: new FormControl(this.cmnService.getLoggedInUserId()),
      fromcity: new FormControl('', [Validators.required]),
      tocity: new FormControl('', [Validators.required]),
      option: new FormControl(),
      lady: new FormControl(),
      travel_date: new FormControl(new Date().toISOString()),
      time: new FormControl(),
      notes: new FormControl(),
      identifier: new FormControl(this.postType),
      incognite: new FormControl(),
      visibility: new FormControl(),
      dts: new FormControl(new Date().toString())
    });
    this.visibilities = [
      {
        "name": "My Friends",
        "value": 0
      },
      {
        "name": "Everyone",
        "value": 1
      }
    ]
    this.travelTime = [
      {
        "name": "Morning",
        "value": 1
      },
      {
        "name": "Afternoon",
        "value": 2
      },
      {
        "name": "Evening",
        "value": 3
      },
    ]
  }

  ngOnInit() {
    // this.getClubRooms();
    // if (this.item) {
    //   this.showData();
    // }
    this.getCities();
    this.setDefaultValues();
    
  }

  setDefaultValues() {
    var currentDate = new Date();
    currentDate.setDate(currentDate.getDate() + 1);
    this.postFG.patchValue({ 'option': this.postType == '0' ? '0' : '' });
    this.postFG.patchValue({ 'incognite': this.postType == '1' ? '1' : '' });
    this.postFG.patchValue({ 'visibility': this.postType == '1' ? 2 : '' });
    this.postFG.patchValue({ 'travel_date': currentDate.toISOString() });
    this.postFG.patchValue({ 'time': this.travelTime[0]["value"]})
  }

  getCities() {
    this.showLoader = true;
    this.serviceWrapper.getApi(API_ENDPOINT_CITY_LIST).subscribe((resp: any) => {
      this.showLoader = false;
      if (resp.status == 1) {
        this.cities = resp["citylist"]
      }
      // else {
      //   this.cmnService.showError(resp.msg)
      // }
    }, err => {
      this.showLoader = false;
    })
  }

  checkBoxChange(ev) {
    this.postFG.patchValue({ lady: ev.target.checked ? 1 : 0 });
  }

  addPost() {
    //console.log(this.postFG.value);
    this.showLoader = true;
    this.serviceWrapper.postApi(API_ENDPOINT_POST_TRAVELLER, this.postFG.value).subscribe((resp: any) => {
      this.showLoader = false;
      //console.log("Post Added success!", resp);
      if (resp.status == 1) {
        this.cmnService.showSuccess(resp.msg);
        this.modal.dismiss('added');
      }
      // else {
      //   this.cmnService.showError(resp.msg);
      // }
    }, (err: any) => {
      this.showLoader = false;
      this.cmnService.showError(err);
    })
  }

  onCancelClick() {
    this.modal.dismiss();
  }

  async presentToast(msg) {
    const toast = await this.toast.create({
      message: msg,
      duration: 2000,
    });
    toast.present();
  }
}
