import { Component, OnInit } from '@angular/core';
import * as GC from '@grapecity/spread-sheets';
import * as Excel from '@grapecity/spread-excelio';
import '@grapecity/spread-sheets-charts';
import {saveAs} from 'file-saver';

@Component({
  selector: 'app-page1',
  templateUrl: './page1.component.html',
  styleUrls: ['./page1.component.scss']
})
export class Page1Component implements OnInit {
  jsonString: string;
  spreadBackColor = 'aliceblue';
  hostStyle = {
    width: '95vw',
    height: '50vh'
  };
  private spread: GC.Spread.Sheets.Workbook;
  private excelIO;
  
  constructor() { }

  ngOnInit(): void {
    this.jsonString = window.history.state.data;
    console.log(this.jsonString)
  }

  workbookInit(args) {
    const self = this;
    self.spread = args.spread;
    const sheet = self.spread.getActiveSheet();
  }

  onFileChange(args) {
    const self = this
    self.spread.fromJSON(JSON.parse(this.jsonString))
  }

}
