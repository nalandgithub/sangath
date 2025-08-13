import { Injectable } from '@angular/core';
import {
  ToastController,
  LoadingController,
  ModalController,
  PopoverController,
  AlertController,
} from '@ionic/angular';
import { Browser } from '@capacitor/browser';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { LOGIN_TOKEN_KEY, SERVER_URL } from '../constant/constant.config';
// import { AuthService } from '../shared-components/auth-service/auth.service.tss';
import { HttpClient } from '@angular/common/http';
import { UniqueDeviceID } from '@ionic-native/unique-device-id/ngx';
import { InfoPopoverComponent } from '../components/info-popover/info-popover.component';
import { MoreMenuPopoverComponent } from '../components/more-menu-popover/more-menu-popover.component';
import { DomSanitizer } from '@angular/platform-browser';
@Injectable({
  providedIn: 'root',
})
export class CmnServiceService {
  isPostAdded: BehaviorSubject<any> = new BehaviorSubject('');
  isQueAdded: BehaviorSubject<any> = new BehaviorSubject('');
  invokeEvent: Subject<any> = new Subject();

  constructor(
    private tc: ToastController,
    private loadingController: LoadingController,
    private http: HttpClient,
    private modalCtrl: ModalController,
    private uniqueDeviceID: UniqueDeviceID,
    private popoverController: PopoverController,
    private alertController: AlertController,
    private sanitizer: DomSanitizer
  ) { }

  async showSuccess(msg) {
    const toast = await this.tc.create({
      message: msg,
      duration: 2000,
      color: 'success',
    });
    toast.present();
  }

  async showError(err) {
    const toast = await this.tc.create({
      message: err,
      duration: 2000,
      color: 'danger',
    });
    toast.present();
  }
  async showWarning(msg) {
    const toast = await this.tc.create({
      message: msg,
      duration: 2000,
      color: 'warning',
    });
    toast.present();
  }

  async showThemeBasedToast(msg) {
    const toast = await this.tc.create({
      message: msg,
      duration: 2000,
      color: 'primary',
    });
    toast.present();
  }

  async showLoader() {
    const loading = await this.loadingController.create({
      translucent: true,
      cssClass: 'custom-class custom-loading',
    });
    return await loading.present();
  }

  async hideLoader() {
    await this.loadingController.dismiss();
  }

  async openInBrowser(url) {
    await Browser.open({ url: url });
  }

  sendTokenToapi(token) {
    let data = {
      fcmToken: token,
    };

    this.http.put(SERVER_URL + 'profiles/v1/token', data).subscribe(
      (res: any) => {
        //console.log('Push token api Res : -', res);
      },
      (err) => {
        //console.log('push token error :-', err);
      }
    );
  }

  getDeviceUniqueToken() {
    this.uniqueDeviceID.get().then((uuid: any) => {
      //console.log(uuid)
      return uuid;
    }).catch((error: any) => {
      //console.log(error);
      return "";
    });
  }

  getLoggedInUserId() {
    let userDetails = JSON.parse(localStorage.getItem('login-details'));
    if (userDetails) {
      return userDetails["data"][0]["user_id"];
    }
    else
      return "";
  }

  setLoginToken(token) {
    if (token)
      localStorage.setItem(LOGIN_TOKEN_KEY, token);
  }
  getLoginToken() {
    return localStorage.getItem(LOGIN_TOKEN_KEY);
  }

  async openInfoPopover(ev, dispText: any) {
    const popover = await this.popoverController.create({
      component: InfoPopoverComponent,
      cssClass: 'popover-opacity',
      event: ev,
      translucent: true,
      componentProps: { displayText: dispText },
      mode: 'ios'
    });
    await popover.present();

    const { role } = await popover.onDidDismiss();
    //console.log('onDidDismiss resolved with role', role);
  }

  async openModal(component, data?: any) {
    const modal = await this.modalCtrl.create({
      component: component,
      componentProps: { "propData": data },
      cssClass: 'my-custom-class'
    });
    return await modal.present();
  }

  closeModal() {
    this.modalCtrl.dismiss();
  }

  async openAnyPopover(component, ev, data,moduleName) {
    // switch (moduleName) {
    //   case "my-friends":
    //     component = MoreMenuPopoverComponent
    //     break;
    //     case "my-posts":
    //     component = MoreMenuPopoverComponent
    //     break;
    
    //   default:
    //     break;
    // }
    const popover = await this.popoverController.create({
      component: component,
      cssClass: 'popover-opacity',
      event: ev,
      translucent: true,
      mode: 'ios',
      showBackdrop:true,
      componentProps: { "componentProps": data, "moduleName":moduleName }
    });
    await popover.present();

    const { role } = await popover.onDidDismiss();
    //console.log('onDidDismiss resolved with role', role);

  }

  closePopover(identifier) {
    return this.popoverController.dismiss(identifier);
  }

  callAnotherComponentMehthod(indentificationValue: any) {
    this.invokeEvent.next(indentificationValue);
  }

  parseAndDisplayHtml(data){
return this.sanitizer.bypassSecurityTrustHtml(data);
  }

}
