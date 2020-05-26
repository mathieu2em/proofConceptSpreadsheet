import { Component, OnInit, ViewChild } from '@angular/core';
import { isUndefined } from 'util';
import { SpreadsheetComponent } from '@syncfusion/ej2-angular-spreadsheet';
import * as $ from 'jquery'; window["$"] = $; window["jQuery"] = $;


@Component({
  selector: 'app-page1',
  templateUrl: './page1.component.html',
  styleUrls: ['./page1.component.scss']
})
export class Page1Component implements OnInit {
  spreadsheetSaved: any;
  // to show or not the div containing the readonly spreadsheet
  isInvisible: boolean;

  @ViewChild('edxSpreadsheet') public spreadsheetObj: SpreadsheetComponent;

  constructor() { }

  ngOnInit(): void {
    
  }
  
  public ngAfterViewInit(): void {
    // assign the value of the data passed from the router (if so) from page2Component
    this.spreadsheetSaved = window.history.state.data;
    console.log(this.spreadsheetSaved); // test
    console.log('yess'); // test
    if(!(isUndefined(this.spreadsheetSaved))){
      this.spreadsheetObj.openFromJson(JSON.stringify(this.spreadsheetSaved.jsonObject));
      this.isInvisible = false;
    } else {
      this.isInvisible = true;
    }
  }
  
  loadFromJSON() {
    var excelObj = $("#spreadsheet").data("ejSpreadsheet");
    excelObj.loadFromJSON(this.spreadsheetSaved);
    console.log("loaded");
}

}
