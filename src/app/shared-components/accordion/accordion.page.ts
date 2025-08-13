import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';

@Component({
  selector: 'app-accordion',
  templateUrl: './accordion.page.html',
  styleUrls: ['./accordion.page.scss'],
})
export class AccordionPage implements OnInit {
  @ViewChild('accordion', { read: ElementRef, static: false }) accordion: ElementRef;
  @Input() expanded = false;
  @Input() expandHeight;
  constructor() { }

  ngOnInit() {
  }

}
