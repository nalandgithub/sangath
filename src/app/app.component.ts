

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
  ) { }

  async ngOnInit(): Promise<void> {
    try {
      console.log("App initializing...");

      if (Capacitor.isPluginAvailable("StatusBar")) {
        StatusBar.setStyle({ style: Style.Default });
        StatusBar.setBackgroundColor({ color: "#961175" });
      }

      await this.splashscreenSetting();

      this.currentPlatform = Capacitor.getPlatform();
      console.log("Platform detected:", this.currentPlatform);
      console.log("Plugin availability:", {
        PushNotifications: Capacitor.isPluginAvailable("PushNotifications"),
        FCM: Capacitor.isPluginAvailable("FCM"),
        Keyboard: Capacitor.isPluginAvailable("Keyboard"),
      });

      if (localStorage.getItem(LOGIN_DETAILS_KEY)) {
        this.getPopupImage();
      }

      await this.setupFirebase();

      this.loggedInUser = JSON.parse(localStorage.getItem("login-details"));
      this.getAppInfoForVersion();
      this.manageKeyboardEvents();

      console.log("App initialization completed successfully");
    } catch (error) {
      console.log("App initialization error:", error);
    }
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
    try {
      if (!Capacitor.isPluginAvailable("PushNotifications")) {
        console.log("PushNotifications plugin not available; skipping push setup.");
        return;
      }
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
        } catch (err) {
          console.log("Channel creation error:", err);
        }
      }

      // Request permission and register ONCE for both platforms
      const perm = await PushNotifications.requestPermissions();
      if (perm.receive === "granted") {
        await PushNotifications.register();

        // For iOS, wait for APNS token registration before getting FCM token
        if (this.currentPlatform === "ios") {
          // Don't try to get FCM token immediately - wait for registration event
          console.log("iOS: Waiting for APNS token registration before FCM token");
        }
      } else {
        // Permission not granted
        console.log("Push notification permission not granted");
        return;
      }
    } catch (error) {
      console.log("Firebase setup error:", error);
    }

    // Device/APNs/FCM token
    PushNotifications.addListener('registration', async (token: any) => {
      console.log('APNS Token (iOS) or FCM (Android):', token.value);

      if (this.currentPlatform === 'android') {
        // Android → token is already the FCM token
        localStorage.setItem(FIREBASE_DEVICE_TOKEN_KEY, token.value);
      } else if (this.currentPlatform === 'ios') {
        // Store APNS token separately
        localStorage.setItem('apns_token', token.value);

        // Add delay to ensure APNs token is processed by Firebase
        setTimeout(async () => {
          await this.getFCMTokenWithRetry();
        }, 1000);
      }
    });

    // Always listen for FCM token refresh → this is critical on iOS
    if (this.currentPlatform === 'ios' && Capacitor.isPluginAvailable("FCM")) {
      try {
        // FCM token refresh comes via PushNotification registration listener
        // Additionally, we set up a periodic check for FCM token updates
        this.setupFCMTokenRefreshCheck();
      } catch (error) {
        console.error('Error setting up FCM token refresh listener:', error);
      }
    }
    PushNotifications.addListener("registrationError", (error: any) => {
      try {
        console.log("Registration error:", error);
        // Don't show alert, just log the error
      } catch (err) {
        console.log("Registration error handler error:", err);
      }
    });

    // Foreground messages → show toast so user sees something
    PushNotifications.addListener(
      "pushNotificationReceived",
      (notification: PushNotificationSchema) => {
        try {
          console.log("Push received (fg): " + JSON.stringify(notification));
          this.showForegroundToast(notification);
        } catch (error) {
          console.log("Push received listener error:", error);
        }
      }
    );

    // Notification tapped (background/killed)
    PushNotifications.addListener(
      "pushNotificationActionPerformed",
      (ev: ActionPerformed) => {
        try {
          console.log("pushNotificationActionPerformed:", ev);
          // Safely pull action regardless of structure
          const data: any =
            (ev?.notification as any)?.data ||
            (ev as any)?.data ||
            {};
          const action = data["action"] || "";
          this.routeFromAction(action);
        } catch (error) {
          console.log("Push action performed listener error:", error);
        }
      }
    );
  }

  getAppInfoForVersion() {
    try {
      App.getInfo().then((info) => {
        if (info && info.version) {
          this.appVersionNum = info.version;
        }
      }).catch((error) => {
        console.log("App.getInfo error:", error);
      });
    } catch (error) {
      console.log("App.getInfo catch error:", error);
    }
  }

  // Show the splash for five seconds and then automatically hide it:
  async splashscreenSetting() {
    try {
      await SplashScreen.show({
        showDuration: 5000,
        autoHide: true,
      });
    } catch (error) {
      console.log("Splash screen error:", error);
    }
  }
  logout() {
    localStorage.clear(); // clears all keys
    localStorage.removeItem("login-token");
    this.navCtrl.navigateRoot("/login");

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
          handler: () => { },
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
          handler: () => { },
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
    try {
      if (!Capacitor.isPluginAvailable("Keyboard")) {
        console.log("Keyboard plugin not available; skipping keyboard listeners.");
        return;
      }
      Keyboard.addListener("keyboardWillShow", (info) => {
        try {
          this.cmnservice.callAnotherComponentMehthod(KEYBOARD_IS_OPEN_INOVKE_KEY);
        } catch (error) {
          console.log("Keyboard will show error:", error);
        }
      });

      Keyboard.addListener("keyboardDidShow", (info) => {
        try {
          // Keyboard did show - no action needed
        } catch (error) {
          console.log("Keyboard did show error:", error);
        }
      });

      Keyboard.addListener("keyboardWillHide", () => {
        try {
          this.cmnservice.callAnotherComponentMehthod(KEYBOARD_IS_CLOSE_INOVKE_KEY);
        } catch (error) {
          console.log("Keyboard will hide error:", error);
        }
      });

      Keyboard.addListener("keyboardDidHide", () => {
        try {
          // Keyboard did hide - no action needed
        } catch (error) {
          console.log("Keyboard did hide error:", error);
        }
      });
    } catch (error) {
      console.log("Keyboard events setup error:", error);
    }
  }

  // Helper method to get FCM token with retry mechanism
  private async getFCMTokenWithRetry(maxRetries: number = 3): Promise<void> {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        if (!Capacitor.isPluginAvailable("FCM")) {
          console.log("FCM plugin not available; skipping FCM token fetch.");
          return;
        }

        const fcmResult = await FCM.getToken();
        if (fcmResult?.token && fcmResult.token.trim() !== '') {
          console.log(`FCM Token (iOS) - Attempt ${attempt}:`, fcmResult.token);
          localStorage.setItem(FIREBASE_DEVICE_TOKEN_KEY, fcmResult.token);
          // Send token to server
          this.sendTokenToServer(fcmResult.token);
          break;
        } else {
          console.log(`FCM.getToken() returned no token on attempt ${attempt}`);
        }
      } catch (err) {
        console.error(`Error getting FCM token on attempt ${attempt}:`, err);
      }

      // If not last attempt, wait before retry
      if (attempt < maxRetries) {
        await new Promise(resolve => setTimeout(resolve, 2000 * attempt)); // Progressive delay
      }
    }
  }

  // Helper method to send FCM token to server
  private sendTokenToServer(token: string): void {
    if (!token || token.trim() === '') {
      console.log('Token is empty, not sending to server');
      return;
    }

    try {
      this.cmnservice.sendTokenToapi(token);
    } catch (error) {
      console.error('Error sending token to server:', error);
    }
  }

  // Setup periodic FCM token refresh check for iOS
  private setupFCMTokenRefreshCheck(): void {
    // Check for FCM token updates every 5 seconds for the first 30 seconds after app start
    let checkCount = 0;
    const maxChecks = 6; // 6 checks at 5 second intervals = 30 seconds

    const checkInterval = setInterval(async () => {
      checkCount++;

      if (checkCount >= maxChecks) {
        clearInterval(checkInterval);
        return;
      }

      try {
        if (Capacitor.isPluginAvailable("FCM")) {
          const fcmResult = await FCM.getToken();
          if (fcmResult?.token && fcmResult.token.trim() !== '') {
            const storedToken = localStorage.getItem(FIREBASE_DEVICE_TOKEN_KEY);
            // Only update if token has changed
            if (storedToken !== fcmResult.token) {
              console.log('FCM Token updated:', fcmResult.token);
              localStorage.setItem(FIREBASE_DEVICE_TOKEN_KEY, fcmResult.token);
              this.sendTokenToServer(fcmResult.token);
            }
          }
        }
      } catch (error) {
        console.error('Error checking FCM token:', error);
      }
    }, 5000); // Check every 5 seconds
  }
}
