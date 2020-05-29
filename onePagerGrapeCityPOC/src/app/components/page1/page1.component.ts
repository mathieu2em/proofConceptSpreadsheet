import { Component, OnInit, ViewChild } from '@angular/core';
import * as GC from '@grapecity/spread-sheets';
import * as Excel from '@grapecity/spread-excelio';
import '@grapecity/spread-sheets-charts';
import { isUndefined } from 'util';
import { Spreadsheet } from '../../models/Spreadsheet';
import { Page2Component } from '../page2/page2.component';

@Component({
  selector: 'app-page1',
  templateUrl: './page1.component.html',
  styleUrls: ['./page1.component.scss']
})

export class Page1Component implements OnInit {
  // a list of spreadsheet components
  // TODO still not sure if the data will stay in it or if I will have to add some fields
  spreadsheets:Spreadsheet[] = [];
  showEditor:boolean = false;
  
  // contains the json value of the spreadsheet saved in page2
  jsonString:string;
  
  spreadBackColor:string = 'aliceblue';
  hostStyle:any;
  
  private spread:GC.Spread.Sheets.Workbook;
  private excelIO:Excel.IO;

  @ViewChild(Page2Component) editor;
  
  constructor() {}
  
  ngOnInit(): void {
    this.excelIO = new Excel.IO();
  }
  
  showEditorBtn(): void{
    this.showEditor = !this.showEditor;
  }

  receiveMessage($event) {
    this.spreadsheets.push($event);
  }
}
