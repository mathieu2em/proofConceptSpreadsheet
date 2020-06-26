import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import * as GC from "@grapecity/spread-sheets";
import * as Excel from '@grapecity/spread-excelio';
import '@grapecity/spread-sheets-charts';
import { Router } from '@angular/router';
import { Spreadsheet } from 'src/app/models/Spreadsheet';

@Component({
  selector: 'app-spreadEditor',
  templateUrl: './spreadEditor.component.html',
  styleUrls: ['./spreadEditor.component.scss']
})

export class SpreadEditorComponent implements OnInit {
  // caracteristiques basiques du spreadsheet
  spreadBackColor:string = 'aliceblue';
  sheetName:string = 'edilex sheet';
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
  public formulaString:string;

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

    this.messageEvent.emit({msg:"add", sh:{id: this.id++, title:this.spreadsheetTitle, jsonData: json, width: width.toString()+'px', height: height.toString()+'px', sels : this.editableCells}});

    this.editableCells = [];
  }

  onClickMeImport(args):void {
    const file: File = args.srcElement && args.srcElement.files && args.srcElement.files[0];
    if (this.spread && file) {
      this.excelIO.open(file, (json) => {
        this.spread.fromJSON(json, {});
        this.editableCells = [];
        setTimeout(() => {
          alert('load successfully');
        }, 0);
      }, (error) => {
        alert('load fail');
      });
    }
  }

  // make sure to have the header stuff
  base64ToBlob(base64Data, contentType):Blob {
      contentType = contentType || '';
      let sliceSize:number = 1024;
      let byteCharacters:string = atob(base64Data);
      let bytesLength:number = byteCharacters.length;
      let slicesCount:number = Math.ceil(bytesLength / sliceSize);
      let byteArrays = new Array(slicesCount);
      for (let sliceIndex = 0; sliceIndex < slicesCount; ++sliceIndex) {
          let begin = sliceIndex * sliceSize;
          let end = Math.min(begin + sliceSize, bytesLength);
  
          let bytes = new Array(end - begin);
          for (let offset:number = begin, i:number = 0; offset < end; ++i, ++offset) {
              bytes[i] = byteCharacters[offset].charCodeAt(0);
          }
          byteArrays[sliceIndex] = new Uint8Array(bytes);
      }
      return new Blob(byteArrays, { type: contentType });
  }

  onClickMeImportB64(args):void {
    const file: File = args.srcElement && args.srcElement.files && args.srcElement.files[0];
    let fileReader = new FileReader();
    fileReader.onload = (e) => {
      let blob:Blob = this.base64ToBlob(fileReader.result, 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      if (this.spread && file) {
        this.excelIO.open(blob, (json) => {
          this.spread.fromJSON(json, {});
          this.editableCells = [];
          setTimeout(() => {
            alert('load successfully');
          }, 0);
        }, (error) => {
          alert('load fail');
        });
      }
      console.log();
    }
    fileReader.readAsText(file);
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

  // example func for font changeing
  setFontStyleExample():void{
    const sheet:GC.Spread.Sheets.Worksheet = this.spread.getActiveSheet();
    let style = new GC.Spread.Sheets.Style();
    const rowIndex:number = 1;
    const colIndex:number = 1;
    const rowCount:number = 1;
    const colCount:number = 1;

    style.font = '12px -apple-system, BlinkMacSystemFont, “Segoe UI”, Roboto, Helvetica, Arial, sans-serif'; // same as CSS font attribute
    // apply style on whole sheet
    sheet.setDefaultStyle(style);
    // set style for a single cell
    sheet.setStyle(rowIndex, colIndex, style);
    // set style for cell range
    var rng = sheet.getRange(rowIndex, colIndex, rowCount, colCount);
    rng.font('12px -apple-system, BlinkMacSystemFont, “Segoe UI”, Roboto, Helvetica, Arial, sans-serif');
  }

  // set current cell selection from client to Italic
  setItalic():void{
    const sheet:GC.Spread.Sheets.Worksheet = this.spread.getActiveSheet();
    const sels:GC.Spread.Sheets.Range          = sheet.getSelections()[0];
    const selection:GC.Spread.Sheets.CellRange = sheet.getRange(sels.row, sels.col, sels.rowCount, sels.colCount);
    if(typeof(selection.font())=="string"){
      let position:number = selection.font().indexOf('italic');
      // means the cellRange is already italic
      if( position > -1){
        selection.font(selection.font().substring(position+6)); // cut the italic word from font
      } else {
        selection.font("italic " + selection.font());
      }
    }
  }

  // set current cell selection from client to show a certain formula result
  setFormula():void{
    const sheet:GC.Spread.Sheets.Worksheet = this.spread.getActiveSheet();
    const sels:GC.Spread.Sheets.Range          = sheet.getSelections()[0];
    const selection:GC.Spread.Sheets.CellRange = sheet.getRange(sels.row, sels.col, sels.rowCount, sels.colCount);
    console.log(this.formulaString);
    selection.formula(this.formulaString);
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
    // set the sheet as protected which means you can lock or unlock cells
    //sheet.options.isProtected = true;
    // Hide column headers.
    //sheet.options.colHeaderVisible = false;
    // Hide row headers.
    //sheet.options.rowHeaderVisible = false;
    // block editing completely
    //sheet.bind(GC.Spread.Sheets.Events.EditStarting, function (sender, args, e) {e.preventDefault()});
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
