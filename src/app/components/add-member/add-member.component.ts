import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { API_ENDPOINT_POST_ADD_MEMBER,API_ENDPOINT_POST_ALL_MEMBER } from 'src/app/constant/constant.config';
import { CmnServiceService } from 'src/app/Service/cmn-service.service';
import { ServicesWrapperService } from 'src/app/Service/services-wrapper.service';

@Component({
  selector: 'add-member',
  templateUrl: './add-member.component.html',
  styleUrls: ['./add-member.component.scss'],
})
export class AddMemberComponent implements OnInit {
  phone:number;
  name:any;
  email:any;
  users:any;
  type:any;
  alertObj: any;
  constructor(
    private cmnService: CmnServiceService,
    private serviceWrapper: ServicesWrapperService,
    private alertCtrl: AlertController) { }

  ngOnInit() { 
    this.getAllUsers();
  }
  getAllUsers(){
    let usersObj = {
      "token": this.cmnService.getLoginToken()
    }
    this.serviceWrapper.postApi(API_ENDPOINT_POST_ALL_MEMBER,usersObj).subscribe((resp:any)=>{
      //console.log("my feedbacks",resp);
      if(resp.status == 1){
        this.users = resp.users;
      }
    })
  }
  submitMember(memberData :any) {
    let addFeedbackObj = {
      "token": this.cmnService.getLoginToken(),
      "phone": memberData.phone,
      "firstname": memberData.firstname,
      "lastname": memberData.lastname,
      "email": memberData.email,
      "type": memberData.type
    }
    this.serviceWrapper.postApi(API_ENDPOINT_POST_ADD_MEMBER, addFeedbackObj).subscribe((resp: any) => {
      if (resp.status == 1) {
        this.alertObj.dismiss();
        this.phone = null;
        this.name = "";
        this.email = "";
        this.cmnService.showSuccess(resp.msg);
        this.getAllUsers();
      }
    })
  }

  async openAddFeedbackModal() {
    this.alertObj = await this.alertCtrl.create({
      cssClass: "bg-white",
      header: "Add New Member",
      mode: "ios",
      inputs: [
        {
          name: "firstname",
          type: "text",
          placeholder: "First Name",
        },
        {
          name: "lastname",
          type: "text",
          placeholder: "Last Name",
        },
        {
          name: "phone",
          type: "number",
          placeholder: "Phone Number",
        },
        {
          name: "email",
          type: "email",
          placeholder: "E-mail ID",
        },
        {
          name: "type",
          type: "number",
          placeholder: "Usertype (1-Normal/0-Admins)",
        },
      ],
      buttons: [
        {
          text: "Add Member",
          handler: (alertData) => {
            //console.log(alertData);
            if (alertData.firstname && alertData.lastname && alertData.email && alertData.phone && alertData.type)
              this.submitMember(alertData);
            else this.cmnService.showError("Please enter Member Details");
            return false;
          },
        },
        {
          text: "Cancel",
          role: "cancel",
          cssClass: "secondary",
          handler: () => {},
        },
      ],
    });
    await this.alertObj.present();
  }
}
