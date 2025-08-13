import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { RouteReuseStrategy } from "@angular/router";

import { IonicModule, IonicRouteStrategy } from "@ionic/angular";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { HTTP } from "@ionic-native/http/ngx";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
// import { AuthService } from './shared-components/auth-service/auth.service.ts';
import { IonicStorageModule } from "@ionic/storage-angular";
import { UniqueDeviceID } from "@ionic-native/unique-device-id/ngx";
// import { Clipboard } from "@awesome-cordova-plugins/clipboard/ngx";
import { File } from "@ionic-native/file/ngx";
// import { CallNumber } from "@awesome-cordova-plugins/call-number/ngx";
import { CommonModule } from "@angular/common";
import { HttpResponseInterceptor } from "./interceptors/http-response-interceptor";
@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot({ scrollAssist: false }),
    AppRoutingModule,
    HttpClientModule,
    IonicStorageModule.forRoot(),
    CommonModule,
  ],
  providers: [
    HTTP,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpResponseInterceptor,
      multi: true,
    },
    // { provide: HTTP_INTERCEPTORS, useClass: AuthService, multi: true },
    File,
    UniqueDeviceID,
    // Clipboard,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
