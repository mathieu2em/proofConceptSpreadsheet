import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { Spreadsheet } from 'src/app/models/Spreadsheet';
import * as GC from "@grapecity/spread-sheets";
import * as Excel from "@grapecity/spread-excelio";
import "@grapecity/spread-sheets-angular";
import "@grapecity/spread-sheets-charts";
import "@grapecity/spread-sheets-print";
import "@grapecity/spread-sheets-pdf";
import { isUndefined } from 'util';
import {saveAs} from 'file-saver';
import { resolve } from 'dns';
import { strict } from 'assert';

@Component({
  selector: 'app-spreadsheet-item',
  templateUrl: './spreadsheet-item.component.html',
  styleUrls: ['./spreadsheet-item.component.scss']
})
export class SpreadsheetItemComponent implements OnInit {
  @Input() spreadsheet:Spreadsheet;
  // contains the json value of the spreadsheet saved in page2
  jsonString:string;
  
  spreadBackColor:string = 'aliceblue';
  hostStyle:any;
  
  private spread:GC.Spread.Sheets.Workbook;
  private excelIO:Excel.IO;

  @Output() messageEvent = new EventEmitter<{msg:string, id:number}>();

  constructor() { }

  ngOnInit(): void {
    this.excelIO = new Excel.IO();
    this.jsonString = this.spreadsheet.jsonData;
    this.hostStyle = {
      width: this.spreadsheet.width,
      height: this.spreadsheet.height
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
    sheet.setActiveCell(null,null); // gives an error but the only way I found not to show any active cell in the readonly ... bruh
    // unlock the cells the user asked to be editable in the editor
    if(!isUndefined(this.spreadsheet.sels)) this.unlockCells(this.spreadsheet.sels);
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

  // base64 converter for the blob. use inside the excelio method
  blobToBase64(blob, callback): void {
    let reader: FileReader = new FileReader();
    reader.onload = ()=>{
        let dataUrl:string | ArrayBuffer = reader.result;
        var base64 = (<string>dataUrl).split(',')[1];
        callback(dataUrl, base64); // (b64blob, b64string)
    };
    reader.readAsDataURL(blob);
  };

  // make sure to have the header stuff
  Base64ToXLSXBlob(b64str){
    const contentType = "";
  }

  onClickMeB64(args):void {
    const filename:string = this.spreadsheet.title+'.txt';
    const jsonstr:string = JSON.stringify(this.spread.toJSON());

    this.excelIO.save(jsonstr, (blob:Blob)=>{
      this.blobToBase64(blob, (b64blob, base64str)=>{
        console.log(base64str);
        console.log(b64blob);
        saveAs(b64blob, "base64.txt");
      });
      //saveAs(blob, filename);
    }, function (e) {
      console.log(e);
    });
  }

  onClickMeXL(args):void {
    const filename:string = this.spreadsheet.title+'.xlsx';
    const jsonstr:string = JSON.stringify(this.spread.toJSON());

    this.excelIO.save(jsonstr, (blob:Blob)=>{
      saveAs(blob, filename);
      //saveAs(blob, filename);
    }, function (e) {
      console.log(e);
    });
  }

  onClickMePDF(args):void {
    const filename:string = this.spreadsheet.title+'.pdf';
    var printInfo: GC.Spread.Sheets.Print.PrintInfo = this.spread.getActiveSheet().printInfo();
    /*
    printInfo.columnStart(0); // PrintArea TODO
    printInfo.columnEnd(3);   // PrintArea TODO
    printInfo.rowStart(0);    // PrintArea TODO
    printInfo.rowEnd(3);      // PrintArea TODO
    */
      printInfo.showGridLine(false);
      printInfo.showRowHeader(GC.Spread.Sheets.Print.PrintVisibilityType.hide);
      printInfo.showColumnHeader(GC.Spread.Sheets.Print.PrintVisibilityType.hide);
      printInfo.headerCenter("GrapeCity");
    const jsonstr:string = JSON.stringify(this.spread.toJSON());

    this.spread.savePDF(function (blob) {
      saveAs(blob, filename + '.pdf');
  }, function (error) {
      console.log(error);
  }, {
      title: 'Test Title',
      author: 'Test Author',
      subject: 'Test Subject',
      keywords: 'Test Keywords',
      creator: 'test Creator'
  });
  }

  sendMessage() {
    this.messageEvent.emit({msg:"del", id:this.spreadsheet.id})
  }
}
