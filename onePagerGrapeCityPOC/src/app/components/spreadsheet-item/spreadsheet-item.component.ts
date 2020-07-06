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
    // unlock the user's selected for unlocking's cells
    if(!isUndefined(this.spreadsheet.sels)) this.unlockCells(this.spreadsheet.sels);
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

  unsetReadonly(spread: GC.Spread.Sheets.Workbook):void{
    const sheet:GC.Spread.Sheets.Worksheet = spread.getActiveSheet();
    spread.options.allowUserDragMerge = true;
    spread.options.allowAutoCreateHyperlink = true;
    spread.options.allowContextMenu = true;
    spread.options.allowDynamicArray = true;
    spread.options.allowSheetReorder = true;
    spread.options.allowUserDragFill = true;
    spread.options.allowUserDragMerge = true;
    spread.options.allowUserResize = true;
    spread.options.allowCopyPasteExcelStyle = true;
    sheet.options.isProtected = false;
    sheet.options.protectionOptions = {
      allowSelectLockedCells : true,
      allowSelectUnlockedCells : true,
      allowSort : true,
      allowFilter : true,
      allowEditObjects : true,
      allowResizeRows : true,
      allowResizeColumns : true,
      allowDeleteColumns : true,
      allowDeleteRows : true,
      allowDragInsertColumns : true,
      allowDragInsertRows : true,
      allowInsertColumns : true,
      allowInsertRows : true,
    }
  }

  // base64 converter for the excel blob. use inside the excelio method
  // if you save the string internally you shoud only keep b64string
  // if you save the string to a file using saveAs from file-save you should use 
  // b64 blob as it gives the file headers 
  blobToBase64(blob, callback): void {
    let reader: FileReader = new FileReader();
    reader.onload = ()=>{
        let dataUrl:string | ArrayBuffer = reader.result;
        var base64 = (<string>dataUrl).split(',')[1];
        callback(dataUrl, base64); // (b64blob, b64string)
    };
    reader.readAsDataURL(blob);
  };

  onClickMe(which:string):void {
    const filename:string = this.spreadsheet.title+'.txt';
    // unprotect the sheet before extracting its JSON, then reprotecting it
    this.unsetReadonly(this.spread);
    // extract modifiable json
    const jsonstr:string = JSON.stringify(this.spread.toJSON());
    // reprotect our baby sheet
    this.setReadonly(this.spread);

    switch(which) {
      // save a base64 encoded string containing the xlsx binary content
      case 'b64': {
        const filename:string = this.spreadsheet.title+'.txt';
        const activeSheet = this.spread.getActiveSheet();
        let printInfo: GC.Spread.Sheets.Print.PrintInfo = activeSheet.printInfo();
        printInfo.columnStart(0); // PrintArea
        printInfo.columnEnd(activeSheet.getColumnCount());   // PrintArea
        printInfo.rowStart(0);    // PrintArea
        printInfo.rowEnd(activeSheet.getRowCount());      // PrintArea
        activeSheet.printInfo(printInfo);
        this.spread.print(0);
        // the excelIO save then call the secont argument method as callback
        this.excelIO.save(jsonstr, (blob:Blob) => {
          // this method encode the blob into base64 string and then return the blob with encoding and base64string
          // if you use saveAs on the base64encoded blob, it is decoded by file-save before being saved 
          // so you have to create a text blob containing only the base64 string and then save it as text file
          this.blobToBase64(blob, (baseBlob, base64str) => {
            console.log(base64str); 
            console.log(baseBlob);
            let b64Blob = new Blob([base64str], {type: "text/plain;charset=utf-8"});
            saveAs(b64Blob, filename);
          });
        }, (e) => {
          console.log(e);
        });
        break;
      }
      // save a excel file as is 
      case 'xlsx': {
        const filename:string = this.spreadsheet.title+'.xlsx';
        this.excelIO.save(jsonstr, (blob:Blob) => {
          saveAs(blob, filename);
        }, (e) => {
          console.log(e);
        });
        break;
      }
      // save into a pdf the spreadsheet
      case 'pdf': {
        const filename:string = this.spreadsheet.title+'.pdf';
        const activeSheet = this.spread.getActiveSheet();
        var printInfo: GC.Spread.Sheets.Print.PrintInfo = activeSheet.printInfo();
        printInfo.columnStart(0);                          // PrintArea
        printInfo.columnEnd(activeSheet.getColumnCount()); // PrintArea
        printInfo.rowStart(0);                             // PrintArea
        printInfo.rowEnd(activeSheet.getRowCount());       // PrintArea
       // printInfo contains all the different format options for the pdf print
        printInfo.showGridLine(false);
        printInfo.showRowHeader(GC.Spread.Sheets.Print.PrintVisibilityType.hide);
        printInfo.showColumnHeader(GC.Spread.Sheets.Print.PrintVisibilityType.hide);
        const jsonstr:string = JSON.stringify(this.spread.toJSON());
        
        this.spread.savePDF(function (blob) {
          saveAs(blob, filename);
        }, function (error) {
          console.log(error);
        }, {
          title: 'Test Title',
          author: 'Test Author',
          subject: 'Test Subject',
          keywords: 'Test Keywords',
          creator: 'test Creator'
        });
        break;
      }
    }
  }

  sendMessage() {
    this.messageEvent.emit({msg:"del", id:this.spreadsheet.id})
  }
}
