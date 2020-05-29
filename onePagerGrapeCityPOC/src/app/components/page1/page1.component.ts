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
  // a list of spreadsheet components
  spreadsheets:GC.Spread.Sheets.Workbook[];
  // contains the json value of the spreadsheet saved in page2
  jsonString:string;
  
  spreadBackColor:string = 'aliceblue';
  hostStyle:any;
  
  private spread:GC.Spread.Sheets.Workbook;
  private excelIO:Excel.IO;
  
  constructor() {}
  
  ngOnInit(): void {
    this.excelIO = new Excel.IO();
    if(!isUndefined(window.history.state.data)){
      this.jsonString = window.history.state.data.json;
      const width:string = window.history.state.data.width.toString() + 'px';
      const height:string = window.history.state.data.height.toString() + 'px';
      //console.log('result='+width+height); //test
      //console.log(this.jsonString) //test
      this.hostStyle = {
        width: width,
        height: height
      };
    } else {
      this.hostStyle = {
        width: '0px',
        height: '0px'
      };
    }
  }
  
  workbookInit(args):void {
    this.spread = args.spread;
    let sheet:GC.Spread.Sheets.Worksheet = this.spread.getActiveSheet();
    sheet.setRowCount(0);
    sheet.setColumnCount(0);
    if(!isUndefined(this.jsonString)){
      this.onFileChange(this.jsonString);
    } 
    sheet = this.spread.getActiveSheet();
    // Hide column headers.
    sheet.options.colHeaderVisible = false;
    // Hide row headers.
    sheet.options.rowHeaderVisible = false;
    // set all the right properties for read-only
    this.setReadonly(this.spread);
    /*
    this.hostStyle.height = this.getRowHeightSum(sheet).toString();
    console.log(this.hostStyle.height);
    this.hostStyle.width = this.getColWidthSum(sheet).toString();
    console.log(this.hostStyle.width);
    */
  }
  
  // use .fromJSON method on spreadsheet component to load table with data and formatting
  onFileChange(args):void {
    this.spread.fromJSON(JSON.parse(this.jsonString))
  }

  onClickMe(args):void {
    const filename:string = 'exportExcel.xlsx';
    const json:string = JSON.stringify(this.spread.toJSON());
    
    this.excelIO.save(json, function (blob) {
      saveAs(blob, filename);
    }, function (e) {
      console.log(e);
    });
  }

  // set all the correct parameters for a usable read-only mode.
  setReadonly(spread: GC.Spread.Sheets.Workbook):void{
    const sheet:GC.Spread.Sheets.Worksheet = spread.getActiveSheet();
    //Hide column headers.
    sheet.options.colHeaderVisible = false;
    //Hide row headers.
    sheet.options.rowHeaderVisible = false;
    spread.options.newTabVisible = false;
    spread.options.showHorizontalScrollbar = false;
    spread.options.showVerticalScrollbar = false;
    spread.options.tabStripVisible = false;
    spread.options.allowUserDragMerge = false;
    spread.options.allowAutoCreateHyperlink = false;
    spread.options.allowContextMenu = false;
    spread.options.allowDynamicArray = false;
    spread.options.allowSheetReorder = false;
    spread.options.allowUserDragFill = false;
    spread.options.allowUserDragMerge = false;
    spread.options.allowUserResize = false;
    spread.options.allowCopyPasteExcelStyle = false;
    sheet.options.isProtected = true;
    this.deactivateScrolling(sheet);
    sheet.options.protectionOptions = {
      allowSelectLockedCells : false,
      allowSelectUnlockedCells : true,
      allowSort : false,
      allowFilter : false,
      allowEditObjects : false,
      allowResizeRows : false,
      allowResizeColumns : false,
      allowDeleteColumns : false,
      allowDeleteRows : false,
      allowDragInsertColumns : false,
      allowDragInsertRows : false,
      allowInsertColumns : false,
      allowInsertRows : false,
    }
    // unlock the cells the user asked to be editable in the editor
    if(!isUndefined(window.history.state.data) && !isUndefined(window.history.state.data.sels)) this.unlockCells(window.history.state.data.sels);
  }

  adjustSize(spread:GC.Spread.Sheets.Workbook):void{
    this.hostStyle.height = this.getRowHeightSum(spread.getActiveSheet()).toString();
  }

  deactivateScrolling(sheet:GC.Spread.Sheets.Worksheet):void{
    const rc:number = sheet.getRowCount();
    const cc:number = sheet.getColumnCount();
    sheet.frozenRowCount(rc);
    sheet.frozenColumnCount(cc);
  }

  getRowHeightSum(sheet:GC.Spread.Sheets.Worksheet):number{
    let height:number = 0;
    let nbrOfRows:number = sheet.getRowCount();
    for(let i=0; i<nbrOfRows; i++){
      height += sheet.getRowHeight(i);
    }
    console.log(height);
    return height;
  }

  getColWidthSum(sheet:GC.Spread.Sheets.Worksheet):number{
    let width:number= 0;
    let nbrOfColumns:number = sheet.getColumnCount();
    for(let i=0; i<nbrOfColumns; i++){
      width += sheet.getColumnWidth(i);
    }
    return width;
  }

  // use the unlockUnlockedCell method on all locked cells from editor
  unlockCells(sels: GC.Spread.Sheets.Range[]):void{
    for(let i=0; i<sels.length; i++){
      this.unlockUnlockedCell(sels[i]);
    }
  }
  
  // unlock only the cells from the selected area in the range object
  // colour them a little bit to let the user know they are editable
  unlockUnlockedCell(sel: GC.Spread.Sheets.Range):void{
    const sheet:GC.Spread.Sheets.Worksheet = this.spread.getActiveSheet();
    for(let i = sel.row; i < (sel.row + sel.rowCount); i++){
      for(let j = sel.col; j < (sel.col + sel.colCount); j++){
        let cell:GC.Spread.Sheets.CellRange = sheet.getCell(i,j);
        cell.locked(false);
        cell.backColor('#ffffb3');
      }
    }
  }
}