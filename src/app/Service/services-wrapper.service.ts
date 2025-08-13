import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { INTERMEDIATE_ENDPOINT, SERVER_URL } from '../constant/constant.config';

@Injectable({
  providedIn: 'root'
})
export class ServicesWrapperService {
  private options: any;
  constructor(
    private httpClient: HttpClient,
  ) {
  }

  getApi(apiEnd) {
    return this.httpClient.get(SERVER_URL + INTERMEDIATE_ENDPOINT + apiEnd);
  }

  postApi(apiEnd, reqObject,fileObj?) {
    return this.httpClient.post(SERVER_URL + INTERMEDIATE_ENDPOINT + apiEnd, this.convertJsonToFormData(reqObject,fileObj));
  }
  postApiForImage(apiEnd, reqObject) {
    return this.httpClient.post(SERVER_URL + INTERMEDIATE_ENDPOINT + apiEnd, this.convertJsonToFormData(reqObject),{headers:{'Content-Type':'multipart/form-data'}});
  }

  private convertJsonToFormData(jsonData,fileObj?) {
    // console.log("Raw json", jsonData);
    var formData = new FormData();
    if (jsonData)
      Object.entries(jsonData).forEach(([key]) => {
        if(key == "image"){
          formData.append("file",fileObj, fileObj.name);
        }
        else
        formData.append(key, jsonData[key]);
      });
    return formData;
  }
}
