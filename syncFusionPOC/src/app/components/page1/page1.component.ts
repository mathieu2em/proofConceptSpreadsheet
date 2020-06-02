import { Component, OnInit, ViewChild } from '@angular/core';
import { isUndefined } from 'util';
import { Spreadsheet } from '@syncfusion/ej2-spreadsheet';
import { getComponent } from '@syncfusion/ej2-base';


@Component({
  selector: 'app-page1',
  templateUrl: './page1.component.html',
  styleUrls: ['./page1.component.scss']
})
export class Page1Component implements OnInit {
  response: any;
  // to show or not the div containing the readonly spreadsheet
  isVisible: boolean = false;

  constructor() { }

  ngOnInit(): void {
    
  }
  
  public ngAfterViewInit(): void {
    // assign the value of the data passed from the router (if so) from page2Component
    this.response = window.history.state.data;
    console.log(this.response); // test
    console.log('yess'); // test
    if(!(isUndefined(this.response))){
      this.loadFromJSON();
    }
  }
  
  loadFromJSON() {
    let spreadsheet: Spreadsheet = getComponent(document.getElementById("sprd2"), "spreadsheet");
    spreadsheet.openFromJson({ file: this.response.jsonObject });
}

}
