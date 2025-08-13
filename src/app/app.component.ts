import { Component, OnInit } from "@angular/core";
import { Capacitor } from "@capacitor/core";
import { StatusBar, Style } from "@capacitor/status-bar";
import { SplashScreen } from "@capacitor/splash-screen";
import { AlertController, MenuController, NavController, ToastController } from "@ionic/angular";
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
    private alertCtrl: AlertController,
    private toastCtrl: ToastController
  ) {}

  async ngOnInit(): Promise<void> {
    if (Capacitor.isPluginAvailable("StatusBar")) {
      StatusBar.setStyle({ style: Style.Default });
      StatusBar.setBackgroundColor({ color: "#961175" });
    }

    await this.splashscreenSetting();

    this.currentPlatform = Capacitor.getPlatform();

    if (localStorage.getItem(LOGIN_DETAILS_KEY)) {
      this.getPopupImage();
    }

    await this.setupFirebase();

    this.loggedInUser = JSON.parse(localStorage.getItem("login-details"));
    this.getAppInfoForVersion();
    this.manageKeyboardEvents();
  }

  /** Toast banner while app is foregrounded (no extra plugin) */
  private async showForegroundToast(n: PushNotificationSchema) {
    const toast = await this.toastCtrl.create({
      header: n.title || "Notification",
      message: n.body || "",
      duration: 3500,
      position: "top",
      color: "primary",
      buttons: [
        {
          text: "Open",
          role: "info",
          handler: () => {
            const data: any = (n as any)?.data || {};
            const action = data["action"] || "";
            this.routeFromAction(action);
          },
        },
      ],
    });
    await toast.present();
  }

  private routeFromAction(action: string) {
    const redirectUrlBase = "/tabs/tabs/";
    switch (action) {
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
        // Optional: fallback
        this.navCtrl.navigateRoot(redirectUrlBase + "tab1");
        break;
    }
  }

  async setupFirebase() {
    // Create Android notification channel once (required for Android 8+)
    if (this.currentPlatform === "android") {
      try {
        await PushNotifications.createChannel({
          id: "high",
          name: "General Notifications",
          description: "General notifications",
          importance: 5, // heads-up
          visibility: 1,
          vibration: true,
        });
      } catch {}
    }

    // Request permission and register ONCE for both platforms
    const perm = await PushNotifications.requestPermissions();
    if (perm.receive === "granted") {
      await PushNotifications.register();

      // iOS: get the FCM token (APNs token alone isn't enough for FCM)
      if (this.currentPlatform === "ios") {
        try {
          const r = await FCM.getToken();
          if (r?.token) {
            console.log("FCM Token (iOS):", r.token);
            localStorage.setItem(FIREBASE_DEVICE_TOKEN_KEY, r.token);
          }
        } catch (err) {
          console.log("FCM getToken error", err);
        }
      }
    } else {
      // Permission not granted
      return;
    }

    // Device/APNs/FCM token
    PushNotifications.addListener("registration", (token: Token) => {
      console.log("Push token:", token.value);
      // Use Android registration token unless you override with FCM token later
      if (this.currentPlatform === "android") {
        localStorage.setItem(FIREBASE_DEVICE_TOKEN_KEY, token.value);
      }
    });

    PushNotifications.addListener("registrationError", (error: any) => {
      alert("Error on registration: " + JSON.stringify(error));
    });

    // Foreground messages → show toast so user sees something
    PushNotifications.addListener(
      "pushNotificationReceived",
      (notification: PushNotificationSchema) => {
        console.log("Push received (fg): " + JSON.stringify(notification));
        this.showForegroundToast(notification);
      }
    );

    // Notification tapped (background/killed)
    PushNotifications.addListener(
      "pushNotificationActionPerformed",
      (ev: ActionPerformed) => {
        console.log("pushNotificationActionPerformed:", ev);
        // Safely pull action regardless of structure
        const data: any =
          (ev?.notification as any)?.data ||
          (ev as any)?.data ||
          {};
        const action = data["action"] || "";
        this.routeFromAction(action);
      }
    );
  }

  getAppInfoForVersion() {
    App.getInfo().then((info) => {
      if (info && info.version) {
        this.appVersionNum = info.version;
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
    this.menuCtrl.toggle();
    this.navCtrl.navigateRoot("/tabs/tabs/tab4", {
      queryParams: { module: moduleName },
    });
  }

  isAppLatest() {
    this.servicesWrapper
      .getApi(API_ENDPOINT_GET_APP_VERSIONS)
      .subscribe((resp: any) => {
        let platform = Capacitor.getPlatform();
        if (resp.status == 1) {
          this.latestVersion =
            platform == "android"
              ? resp.android_version
              : platform == "ios"
              ? resp.ios_version
              : "";
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
          handler: () => {},
        },
        {
          text: "Update",
          handler: () => {
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
    this.cmnservice.showLoader();
    let addFrndObj = {
      token: this.cmnservice.getLoginToken(),
      userid: this.cmnservice.getLoggedInUserId(),
      sangathid: sangathId,
    };
    this.servicesWrapper
      .postApi(API_ENDPOINT_ADD_FRIEND, addFrndObj)
      .subscribe((resp: any) => {
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
    });

    Keyboard.addListener("keyboardDidShow", (info) => {});

    Keyboard.addListener("keyboardWillHide", () => {
      this.cmnservice.callAnotherComponentMehthod(KEYBOARD_IS_CLOSE_INOVKE_KEY);
    });

    Keyboard.addListener("keyboardDidHide", () => {});
  }
}
