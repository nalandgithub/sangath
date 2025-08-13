import { Component, OnInit } from '@angular/core';
import { NavParams } from '@ionic/angular';

@Component({
  selector: 'app-info-popover',
  templateUrl: './info-popover.component.html',
  styleUrls: ['./info-popover.component.scss'],
})
export class InfoPopoverComponent implements OnInit {

  constructor(public navParams: NavParams) {
    const displayText = this.navParams.get('displayText');
    
  }

  ngOnInit() { }
  
}
