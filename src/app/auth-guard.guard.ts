import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { NavController } from '@ionic/angular';
import { Observable } from 'rxjs';
// import { AuthService } from './shared-components/auth-service/auth.service.ts';

@Injectable({
  providedIn: 'root',
})
export class AuthGuardGuard implements CanActivate {
  constructor(
    // private authService: AuthService,
    private navCtrl: NavController
  ) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    const currentUser = localStorage.getItem("login-token");
    //console.log('Current User', currentUser);

    if (!currentUser) {
      return true;
    }

    this.navCtrl.navigateRoot('tabs/tabs/tab1');
    return false;
  }
}
