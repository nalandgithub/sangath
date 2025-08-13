import { Component, OnInit } from '@angular/core';
import { NavParams } from '@ionic/angular';
import { CmnServiceService } from 'src/app/Service/cmn-service.service';

@Component({
  selector: 'app-popup-image',
  templateUrl: './popup-image.component.html',
  styleUrls: ['./popup-image.component.scss'],
})
export class PopupImageComponent implements OnInit {
  imgSrc: any;
  isChecked: any;
  constructor(private navParams: NavParams,
    private cmnService: CmnServiceService) {
    //console.log("propData", this.navParams.get('propData'));
    this.imgSrc = this.navParams.get('propData');
  }

  ngOnInit() { }

  onCheckboxChange(event) {
    //console.log("event", event);
    this.isChecked = event.detail.checked;
    //console.log("isChecked", this.isChecked);
    if (this.isChecked) {
      this.cmnService.closeModal();
    }
  }

}
