import { Component, OnInit } from '@angular/core';
import * as GC from '@grapecity/spread-sheets';
import * as Excel from '@grapecity/spread-excelio';
import '@grapecity/spread-sheets-charts';
import {saveAs} from 'file-saver';
import { isUndefined } from 'util';

@Component({
  selector: 'app-page1',
  templateUrl: './page1.component.html',
  styleUrls: ['./page1.component.scss']
})
export class Page1Component implements OnInit {
  // contains the json value of the spreadsheet saved in page2
  jsonString: string;

  spreadBackColor = 'aliceblue';
  hostStyle = {
    width: '95vw',
    height: '50vh'
  };

  private spread: GC.Spread.Sheets.Workbook;
  private excelIO;
  
  constructor() {}

  ngOnInit(): void {
    this.jsonString = window.history.state.data;
    console.log(this.jsonString)
  }

  public ngAfterViewInit(): void {
    if(!isUndefined(this.jsonString)){
      this.onFileChange(this.jsonString);
    } 
  }

  workbookInit(args) {
    const self = this;
    self.spread = args.spread;
    const sheet = self.spread.getActiveSheet();
    sheet.setRowCount(0);
    sheet.setColumnCount(0);
  }

  // use .fromJSON method on spreadsheet component to load table with data and formatting
  onFileChange(args) {
    const self = this
    self.spread.fromJSON(JSON.parse(this.jsonString))
  }

  tooltip(param: any) {
    return `<span> ${param} </span>`;
  }

  onClickMe(args) {
    const self = this;
    const filename = 'exportExcel.xlsx';
    const json = JSON.stringify(self.spread.toJSON());
    
    self.excelIO.save(json, function (blob) {
      saveAs(blob, filename);
    }, function (e) {
      console.log(e);
    });
  }

}
