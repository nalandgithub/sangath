import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { NavController } from "@ionic/angular";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { RESPONSE_API_TOKEN_MISMATCH } from "../constant/constant.config";
import { CmnServiceService } from "../Service/cmn-service.service";

@Injectable()
export class HttpResponseInterceptor implements HttpInterceptor {
    constructor(private navCtrl: NavController,
        private cmnService: CmnServiceService,
        private router: Router) {
        //console.log("From INTERCEPTOR");
    }
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(req).pipe(map((event: HttpEvent<any>) => {
            //console.log("Resp Interceptor event", event);
            if (event instanceof HttpResponse) {
                if (event?.body?.status != 1) {
                    if (event?.body?.msg != "No Image")
                        this.cmnService.showError(event?.body?.msg);
                        this.cmnService.hideLoader();
                    if (event?.body?.msg == RESPONSE_API_TOKEN_MISMATCH) {
                        localStorage.removeItem("login-token");
                        this.navCtrl.navigateRoot("/login");
                    }
                }

            }

            return event;
        }));
    }
}