import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpBackend } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { SERVER_URL } from 'src/app/constant/constant.config';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private httpWithoutInterceptor: HttpClient;

  constructor(private httpClient: HttpClient, private httpBackend: HttpBackend) {
    this.httpWithoutInterceptor = new HttpClient(httpBackend);
   }

  // sendOTP(num, role) {
  //   return new Promise(res => {
  //     let body = {
  //       "phoneNo": 9640138373,
  //       "role": "student"
  //     }
  //     this.httpClient.get("users/v1/send-otp", {}, body)
  //       .subscribe(data => {
  //         // data.data ? res(JSON.parse(data.data)) : res(true);
  //         return res(data);
  //       })
  //   })
  // }

  sendOTP(orgID, mob, role) {
    const body = {
      "orgID": orgID,
      "phoneNo": mob,
      "role": role
    }
    let url = SERVER_URL + "users/v1/send-otp";
    const config = { headers: new HttpHeaders().set('Content-Type', 'application/json') };

    return new Promise(res => {
      this.httpClient.post<any>(url, body, config).subscribe(result => {
        //console.log(result);
        return res(result);
      });
    })
  }

  login(uId, orgID, otp) {
    const body = {
      "userID": uId,
      "orgID": orgID,
      "otp": parseInt(otp)
    }
    let url = SERVER_URL + "users/v1/user-login";
    const config = { headers: new HttpHeaders().set('Content-Type', 'application/json') };
    return new Promise(res => {
      this.httpClient.post<any>(url, body, config).subscribe((result) => {
        //console.log(result);
        return res(result);
      },
      (error) =>{
        return res(error);
      });
    })
  }
}
