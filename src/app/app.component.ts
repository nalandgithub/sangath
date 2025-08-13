import { Component, OnInit } from "@angular/core";
import { Capacitor } from "@capacitor/core";
import { StatusBar, Style } from "@capacitor/status-bar";
import { SplashScreen } from "@capacitor/splash-screen";
import { AlertController, MenuController, NavController } from "@ionic/angular";
import { ServicesWrapperService } from "./Service/services-wrapper.service";
import {
  API_ENDPOINT_ADD_FRIEND,
  API_ENDPOINT_GET_APP_VERSIONS,
  API_ENDPOINT_GET_POP_IMAGE,
  FIREBASE_DEVICE_TOKEN_KEY,
  FIREBASE_PUSH_REDIRECTION_ACTION_FRIENDREQUEST,
  FIREBASE_PUSH_REDIRECTION_ACTION_HASACAR,
  FIREBASE_PUSH_REDIRECTION_ACTION_HOME,
  FIREBASE_PUSH_REDIRECTION_ACTION_MYPOSTS,
  FIREBASE_PUSH_REDIRECTION_ACTION_WANTTOTRAVEL,
  KEYBOARD_IS_CLOSE_INOVKE_KEY,
  KEYBOARD_IS_OPEN_INOVKE_KEY,
  LOGIN_DETAILS_KEY,
} from "./constant/constant.config";
import { PopupImageComponent } from "./components/popup-image/popup-image.component";
import { CmnServiceService } from "./Service/cmn-service.service";
import {
  ActionPerformed,
  PushNotificationSchema,
  PushNotifications,
  Token,
} from "@capacitor/push-notifications";
import { FCM } from "@capacitor-community/fcm";
import { App } from "@capacitor/app";
import { Browser } from "@capacitor/browser";
import { Keyboard } from "@capacitor/keyboard";
@Component({
  selector: "app-root",
  templateUrl: "app.component.html",
  styleUrls: ["app.component.scss"],
})
export class AppComponent implements OnInit {
  currentPlatform: any;
  appVersionNum: any;
  alertObj: any;
  loggedInUser: any;
  latestVersion: any;
  constructor(
    private navCtrl: NavController,
    private menuCtrl: MenuController,
    private servicesWrapper: ServicesWrapperService,
    private cmnservice: CmnServiceService,
    private alertCtrl: AlertController
  ) {}
  ngOnInit(): void {
    if (Capacitor.isPluginAvailable("StatusBar")) {
      StatusBar.setStyle({ style: Style.Default });
      StatusBar.setBackgroundColor({ color: "#961175" });
    }

    // setTimeout(() => {
    //   SplashScreen.hide();
    // }, 5000);
    this.splashscreenSetting();

    this.currentPlatform = Capacitor.getPlatform();
    //console.log("Platform", this.currentPlatform);
    if (localStorage.getItem(LOGIN_DETAILS_KEY)) {
      this.getPopupImage();
    }
    this.setupFirebase();
    this.loggedInUser = JSON.parse(localStorage.getItem("login-details"));
    this.getAppInfoForVersion();
    // this.isAppLatest();
    this.manageKeyboardEvents();
  }

  setupFirebase() {
    // Request permission to use push notifications
    // iOS will prompt user and return if they granted permission or not
    // Android will just grant without prompting
    PushNotifications.requestPermissions().then((result) => {
      //console.log("requestPermissions Firebase", result);
      if (result.receive === "granted") {
        PushNotifications.register();
        // Register with Apple / Google to receive push via APNS/FCM
        if (this.currentPlatform == "android") {
          PushNotifications.register();
        } else if (this.currentPlatform == "ios") {
          FCM.getToken()
            .then((r) => {
              console.log("FCM Token from gettoken", r);
              localStorage.setItem(FIREBASE_DEVICE_TOKEN_KEY, r.token);
              // alert(`Token ${r.token}`)
            })
            .catch((err) => console.log("FCM gettoken", err));
        }
      } else {
        // Show some error
        //console.log("Permission not granted");
      }
    });

    // On success, we should be able to receive notifications
    PushNotifications.addListener("registration", (token: Token) => {
      // console.log("Push registration success, token: " + token.value);
      // localStorage.setItem(FIREBASE_DEVICE_TOKEN_KEY, token.value);
      if (this.currentPlatform == "android")
        localStorage.setItem(FIREBASE_DEVICE_TOKEN_KEY, token.value);
    });

    // Some issue with our setup and push will not work
    PushNotifications.addListener("registrationError", (error: any) => {
      alert("Error on registration: " + JSON.stringify(error));
    });

    // Show us the notification payload if the app is open on our device
    PushNotifications.addListener(
      "pushNotificationReceived",
      (notification: PushNotificationSchema) => {
        //console.log("Push received: " + JSON.stringify(notification));
      }
    );

    // Method called when tapping on a notification
    PushNotifications.addListener(
      "pushNotificationActionPerformed",
      (notification: ActionPerformed) => {
        //console.log("Push action performed: " + JSON.stringify(notification));
        if (notification.actionId == "tap") {
          if (
            notification.notification.data["action"] &&
            notification.notification.data["action"] != ""
          ) {
            //console.log("from notif", notification.notification.data["action"]);
            let redirectUrlBase = "/tabs/tabs/";
            switch (notification.notification.data["action"]) {
              case FIREBASE_PUSH_REDIRECTION_ACTION_HOME:
                this.navCtrl.navigateRoot(redirectUrlBase + "tab1");
                break;
              case FIREBASE_PUSH_REDIRECTION_ACTION_MYPOSTS:
                this.navCtrl.navigateRoot(redirectUrlBase + "tab2");
                break;
              case FIREBASE_PUSH_REDIRECTION_ACTION_FRIENDREQUEST:
                this.navCtrl.navigateRoot(redirectUrlBase + "tab-friends", {
                  queryParams: { segment: 1 },
                });
                break;
              case FIREBASE_PUSH_REDIRECTION_ACTION_HASACAR:
                this.navCtrl.navigateRoot(redirectUrlBase + "tab1", {
                  queryParams: { segment: 1 },
                });
                break;
              case FIREBASE_PUSH_REDIRECTION_ACTION_WANTTOTRAVEL:
                this.navCtrl.navigateRoot(redirectUrlBase + "tab1", {
                  queryParams: { segment: 0 },
                });
                break;
              default:
                break;
            }
          }
        }
      }
    );
  }

  getAppInfoForVersion() {
    App.getInfo().then((info) => {
      //console.log("Cap App info", info);
      if (info && info.version) {
        this.appVersionNum = info.version;
        // this.isAppLatest();
      }
    });
  }

  // Show the splash for five seconds and then automatically hide it:
  async splashscreenSetting() {
    await SplashScreen.show({
      showDuration: 5000,
      autoHide: true,
    });
  }

  redirectFromSideMenu(moduleName: any) {
    //console.log("From side menu", moduleName);
    this.menuCtrl.toggle();
    this.navCtrl.navigateRoot("/tabs/tabs/tab4", {
      queryParams: { module: moduleName },
    });
  }

  isAppLatest() {
    this.servicesWrapper
      .getApi(API_ENDPOINT_GET_APP_VERSIONS)
      .subscribe((resp: any) => {
        // return Capacitor.getPlatform();
        //console.log("version", resp);
        //console.log("platform", Capacitor.getPlatform());
        let platform = Capacitor.getPlatform();
        if (resp.status == 1) {
          this.latestVersion =
            platform == "android"
              ? resp.android_version
              : platform == "ios"
              ? resp.ios_version
              : "";
          //console.log("latestVersion", this.latestVersion);
          if (this.latestVersion != this.appVersionNum) {
            this.showUpdateAlert();
          }
        }
      });
  }

  async showUpdateAlert() {
    let alert = await this.alertCtrl.create({
      header: "Update Available",
      message:
        "A new version of this app is available. Please update to the latest version to continue using the app.",
      buttons: [
        {
          text: "Cancel",
          role: "cancel",
          handler: () => {
            //console.log("Cancel clicked");
          },
        },
        {
          text: "Update",
          handler: () => {
            // this.openUrl(this.latestVersion);
            this.openUrl("http://onelink.to/3vpbfy");
          },
        },
      ],
    });
    await alert.present();
  }

  async openUrl(url) {
    await Browser.open({ url: url });
  }

  getPopupImage() {
    this.servicesWrapper
      .getApi(API_ENDPOINT_GET_POP_IMAGE)
      .subscribe((resp: any) => {
        //console.log("popup image", resp);
        if (resp.status == 1)
          this.cmnservice.openModal(PopupImageComponent, resp.imgurl);
      });
  }

  async presentAlertPrompt() {
    this.alertObj = await this.alertCtrl.create({
      cssClass: "bg-white",
      header: "Add Friend",
      mode: "ios",
      inputs: [
        {
          name: "sangathIdTxt",
          type: "number",
          placeholder: "Enter Friend's Sangath ID",
        },
      ],
      buttons: [
        {
          text: "Send Request",
          handler: (alertData) => {
            //console.log(alertData.sangathIdTxt);
            if (alertData.sangathIdTxt)
              this.sendFriendRequest(alertData.sangathIdTxt);
            else this.cmnservice.showError("Please enter valid SangathId.");
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

  sendFriendRequest(sangathId) {
    // this.showLoader = true;
    this.cmnservice.showLoader();
    let addFrndObj = {
      token: this.cmnservice.getLoginToken(),
      userid: this.cmnservice.getLoggedInUserId(),
      sangathid: sangathId,
    };
    this.servicesWrapper
      .postApi(API_ENDPOINT_ADD_FRIEND, addFrndObj)
      .subscribe((resp: any) => {
        // this.showLoader = false;
        this.cmnservice.hideLoader();
        if (resp.status == 1) {
          this.alertObj.dismiss();
          this.menuCtrl.toggle();
          this.cmnservice.showSuccess(resp.msg);
          return true;
        } else {
          return false;
        }
      });
  }

  manageKeyboardEvents() {
    Keyboard.addListener("keyboardWillShow", (info) => {
      this.cmnservice.callAnotherComponentMehthod(KEYBOARD_IS_OPEN_INOVKE_KEY);
      //console.log("keyboard will show with height:", info.keyboardHeight);
    });

    Keyboard.addListener("keyboardDidShow", (info) => {
      //console.log("keyboard did show with height:", info.keyboardHeight);
    });

    Keyboard.addListener("keyboardWillHide", () => {
      this.cmnservice.callAnotherComponentMehthod(KEYBOARD_IS_CLOSE_INOVKE_KEY);
      //console.log("keyboard will hide");
    });

    Keyboard.addListener("keyboardDidHide", () => {
      //console.log("keyboard did hide");
    });
  }
}
