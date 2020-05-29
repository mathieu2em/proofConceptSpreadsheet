import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import * as GC from "@grapecity/spread-sheets";
import * as Excel from '@grapecity/spread-excelio';
import '@grapecity/spread-sheets-charts';
import { Router } from '@angular/router';
import { Spreadsheet } from 'src/app/models/Spreadsheet';

@Component({
  selector: 'app-page2',
  templateUrl: './page2.component.html',
  styleUrls: ['./page2.component.scss']
})

export class Page2Component implements OnInit {
  // caracteristiques basiques du spreadsheet
  spreadBackColor:string = 'aliceblue';
  sheetName:string = 'people list';
  hostStyle: object = {
    width: '800px',
    height: '300px'
  };

  // les utilitaires pour l'import export
  private spread: GC.Spread.Sheets.Workbook;
  private excelIO: Excel.IO;
  private editableCells: GC.Spread.Sheets.Range[];
  private id: number = 0;
  public spreadsheetTitle:string;

  @Output() messageEvent = new EventEmitter<{msg:string, sh:Spreadsheet}>();

  constructor( private readonly _router: Router ){}
  
  ngOnInit():void {
    this.excelIO = new Excel.IO();
    this.editableCells = [];
  }

  columnWidth:number = 100;

  workbookInit(args):void{
    this.spread = args.spread;
    let sheet:GC.Spread.Sheets.Worksheet =  this.spread.getActiveSheet();
    //sheet.getCell(0,0).text("cet Individu").foreColor("blue");
    sheet.setRowCount(6);
    this.spread.options.allowUserDragMerge = true;
  }

  sendMessage() {
    const json:string                      = JSON.stringify(this.spread.toJSON(true));
    const sheet:GC.Spread.Sheets.Worksheet = this.spread.getActiveSheet();
    let width:number = this.getColWidthSum(sheet);
    let height:number = this.getRowHeightSum(sheet);

    this.messageEvent.emit({msg:"add", sh:{id: this.id++, title:this.spreadsheetTitle, jsonData: json, width: width.toString()+'px', height: height.toString()+'px', sels : this.editableCells}})
  }

  onClickMeImport(args):void {
    const file: File = args.srcElement && args.srcElement.files && args.srcElement.files[0];
    if (this.spread && file) {
      this.excelIO.open(file, (json) => {
        this.spread.fromJSON(json, {});
        setTimeout(() => {
          alert('load successfully');
        }, 0);
      }, (error) => {
        alert('load fail');
      });
    }
  }

  goToComponentB(passedObj: Object): void {
    this._router.navigate(['/page1'], {state: {data: passedObj}});
  }
    
  addColumnBtn():void{
    const sheet:GC.Spread.Sheets.Worksheet = this.spread.getActiveSheet();
    sheet.addColumns(sheet.getColumnCount(),1);
  }

  addRowBtn():void{
    const sheet:GC.Spread.Sheets.Worksheet = this.spread.getActiveSheet();
    sheet.addRows(sheet.getColumnCount(),1);
  }

  rmColumnBtn():void{
    const sheet:GC.Spread.Sheets.Worksheet = this.spread.getActiveSheet();
    sheet.deleteColumns(sheet.getColumnCount()-1,sheet.getColumnCount())
  }

  rmRowBtn():void{
    const sheet:GC.Spread.Sheets.Worksheet = this.spread.getActiveSheet();
    sheet.deleteRows(sheet.getRowCount()-1,sheet.getRowCount());
  }


  // add borders to selected cells 
  addBorders():void{
    const sheet:GC.Spread.Sheets.Worksheet     = this.spread.getActiveSheet();
    const sels:GC.Spread.Sheets.Range          = sheet.getSelections()[0];
    const border:GC.Spread.Sheets.LineBorder   = new GC.Spread.Sheets.LineBorder("black",GC.Spread.Sheets.LineStyle.medium);
    const selection:GC.Spread.Sheets.CellRange = sheet.getRange(sels.row, sels.col, sels.rowCount, sels.colCount);
    selection.borderTop(border);
    selection.borderBottom(border);
    selection.borderLeft(border);
    selection.borderRight(border);
  }

  // get the sum of row heights in pixel
  getRowHeightSum(sheet:  GC.Spread.Sheets.Worksheet):number{
    let height:number = 0;
    let nbrOfRows:number = sheet.getRowCount();
    for(let i:number=0; i<nbrOfRows; i++){
      height += sheet.getRowHeight(i);
    }
    console.log(height);
    return height;
  }
  // get the sum of column widths in pixel
  getColWidthSum(sheet:  GC.Spread.Sheets.Worksheet):number{
    let width = 0;
    let nbrOfColumns = sheet.getColumnCount();
    for(let i=0; i<nbrOfColumns; i++){
      width += sheet.getColumnWidth(i);
    }
    return width;
  }
  
  setLimitedUse(spread: GC.Spread.Sheets.Workbook):void{
    let sheet = spread.getActiveSheet();
    // sheet.options.isProtected = true;
    // Hide column headers.
    //sheet.options.colHeaderVisible = false;
    // Hide row headers.
    //sheet.options.rowHeaderVisible = false;
    // block editing completely
    /*sheet.bind(GC.Spread.Sheets.Events.EditStarting, function (sender, args, e) {e.preventDefault()});*/
    // block sheet adding
    spread.options.newTabVisible = false;
    //spread.options.showHorizontalScrollbar = false;
    //spread.options.showVerticalScrollbar = false;
    //spread.options.tabStripVisible = false;
    //spread.options.allowUserDragMerge = false;
    //spread.options.allowAutoCreateHyperlink = false;
    //spread.options.allowContextMenu = false;
    //spread.options.allowDynamicArray = false;
    //this.deactivateScrolling(sheet);
    //sheet.options.isProtected = true;
  }

  // add the selected cell to an array that will be used as a selection 
  // for cells to unlock in page 1
  unlockCells():void {
    let sheet:GC.Spread.Sheets.Worksheet = this.spread.getActiveSheet();
    let sels:GC.Spread.Sheets.Range[] = sheet.getSelections();
    //console.log(sels[0]); // test
    this.editableCells.push(sels[0]);
  }

  deactivateScrolling(sheet: GC.Spread.Sheets.Worksheet):void{
    const rc:number = sheet.getRowCount();
    const cc:number = sheet.getColumnCount();
    sheet.frozenRowCount(rc);
    sheet.frozenColumnCount(cc);
  }
}
