import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { MenuController, NavController } from "@ionic/angular";
import {
  API_ENDPOINT_CHECK_OTP,
  API_ENDPOINT_LOGIN,
  API_ENDPOINT_RESEND_OTP,
  FIREBASE_DEVICE_TOKEN_KEY,
  LOGIN_DETAILS_KEY,
  SERVER_URL,
} from "../constant/constant.config";
import { CmnServiceService } from "../Service/cmn-service.service";
import { ServicesWrapperService } from "../Service/services-wrapper.service";

// import { AuthService } from '../shared-components/auth-service/auth.service.ts';
import { LoginService } from "./service/login.service";

@Component({
  selector: "app-login",
  templateUrl: "./login.page.html",
  styleUrls: ["./login.page.scss"],
})
export class LoginPage implements OnInit {
  showLoginLoader = false;
  showStartLoader = false;
  mobile_number: number;
  enableStartButton: boolean = false;
  enableLoginButton: boolean = false;
  otpData;
  otp: string;
  loginData: any;
  authToken: string;
  authenticated: boolean = false;
  selectedRole: any;
  selectedInstitute: any;
  min = "01";
  second = 59;
  // LoginSelected: boolean = false;
  f1;
  f2;
  f3;
  f4;
  f5;
  f6;
  showResendButton: boolean = false;

  constructor(
    private loginService: LoginService,
    // private authService: AuthService,
    private router: Router,
    private httpClient: HttpClient,
    private cmnService: CmnServiceService,
    private serviceWrapper: ServicesWrapperService,
    private navCtrl: NavController,
    private menuCtrl: MenuController
  ) {
    //console.log(this.selectedRole, this.selectedInstitute);
  }

  ngOnInit() {
    // this.startTimer();
  }

  ionViewWillEnter() {
    this.menuCtrl.enable(false);
  }

  otp_screen: boolean = false;

  startTimer() {
    var timer = 119;
    var minutes;
    var seconds;

    let interval = setInterval(() => {
      minutes = Math.floor(timer / 60);
      seconds = Math.floor(timer % 60);

      minutes = minutes < 10 ? "0" + minutes : minutes;
      seconds = seconds < 10 ? "0" + seconds : seconds;

      this.min = minutes;
      this.second = seconds;

      --timer;
      if (timer < 0) {
        clearInterval(interval);
        this.showResendButton = true;
        //console.log('timer is ended');
      }
    }, 1000);
  }

  async send_otp() {
    const body = {
      phone: this.mobile_number,
    };

    this.showStartLoader = true;
    this.startTimer();
    this.serviceWrapper.postApi(API_ENDPOINT_LOGIN, body).subscribe(
      (resp: any) => {
        this.showStartLoader = false;
        if (resp.status == 0) {
          // this.cmnService.showError(resp.msg);
        } else {
          this.otp_screen = true;
          this.otpData = resp;
        }

        //console.log(resp);
        // this.startTimer();
      },
      (err) => {
        this.showStartLoader = false;
        this.cmnService.showError(
          "You cannot login. Please contact administrator."
        );

        //console.log('err => ', err);
      }
    );
    // this.httpClient
    //   .post<any>(SERVER_URL + 'Api/userlogin', body, config)
    //   .subscribe(
    //     (result) => {
    //       this.showStartLoader = false;
    //       this.otp_screen = true;
    //       console.log(result);
    //       this.startTimer();
    //       this.otpData = result;
    //     },
    //     (err) => {
    //       this.showStartLoader = false;
    //       this.cmnService.showError(
    //         'You cannot login. Please contact administrator.'
    //       );

    //       console.log('err => ', err);
    //     }
    //   );
  }

  async onResendOtpClick() {
    this.showResendButton = false;
    this.startTimer();
    let data = {
      phone: this.mobile_number,
    };

    this.serviceWrapper.postApi(API_ENDPOINT_RESEND_OTP, data).subscribe(
      (res: any) => {
        this.cmnService.showSuccess("Otp sent successfully.");
        console.log("Resend Otp", res);
      },
      (err) => {
        console.log("resend otp", err);
      }
    );
  }

  otpController(event, next, prev) {
    if (event.target.value.length < 1 && prev) {
      prev.setFocus();
    } else if (next && event.target.value.length > 0) {
      next.setFocus();
    } else {
      return 0;
    }
  }

  mobile_numberfn(num) {
    if (num.length == 10) {
      this.enableStartButton = true;
    } else {
      this.enableStartButton = false;
    }
  }

  otp_numberfn(otp1, otp2, otp3, otp4, otp5, otp6) {
    // if (
    //   otp1.value != '' &&
    //   otp2.value != '' &&
    //   otp3.value != '' &&
    //   otp4.value != '' &&
    //   otp5.value != '' &&
    //   otp6.value != ''
    // ) {
    //   this.enableLoginButton = true;
    //   this.otp = otp1.value + otp2.value + otp3.value + otp4.value + otp5.value + otp6.value;
    // } else {
    //   this.enableLoginButton = false;
    // }
  }

  onOTPkeyup(event) {
    //console.log("OTP", this.otp);
    //console.log("Otp len", this.otp.length);
    if (this.otp)
      if (this.otp.length > 5) {
        this.enableLoginButton = true;
      } else {
        this.enableLoginButton = false;
      }
  }

  login() {
    this.showLoginLoader = true;
    if (this.otp?.length > 5) {
      let checkOtpObj = {
        phone: this.mobile_number,
        otp: this.otp,
        fingerprint: localStorage.getItem(FIREBASE_DEVICE_TOKEN_KEY),
      };
      this.serviceWrapper
        .postApi(API_ENDPOINT_CHECK_OTP, checkOtpObj)
        .subscribe(
          (resp: any) => {
            this.showLoginLoader = false;
            //console.log("check OTP success", resp);
            if (resp.status == 0) {
              // this.cmnService.showError(resp.msg);
            } else if (resp.status == 1) {
              this.loginData = resp;
              localStorage.setItem(LOGIN_DETAILS_KEY, JSON.stringify(resp));
              this.cmnService.setLoginToken(this.loginData.data[0].login_token);
              // this.router.navigateByUrl('/tabs');
              this.navCtrl.navigateRoot("/tabs");
            }
          },
          (err) => {
            //console.log("check OTP error", err)
            this.showLoginLoader = false;
            this.cmnService.showError(err.msg);
          }
        );
    } else {
      this.cmnService.showError("Please enter valid otp.");
      this.showLoginLoader = false;
    }
  }

  goBack() {
    if (this.otp_screen) this.otp_screen = false;
    else this.router.navigateByUrl("registration");
  }
  // test(ev) {
  //   console.log("From Test", ev)
  // }
}
