import { Component, OnInit } from '@angular/core';
import * as GC from "@grapecity/spread-sheets";
import * as Excel from '@grapecity/spread-excelio';
import '@grapecity/spread-sheets-charts';
import { Router } from '@angular/router';

@Component({
  selector: 'app-page2',
  templateUrl: './page2.component.html',
  styleUrls: ['./page2.component.scss']
})

export class Page2Component implements OnInit {
  // caracteristiques basiques du spreadsheet
  spreadBackColor = 'aliceblue';
  sheetName = 'people list';
  hostStyle = {
    width: '800px',
    height: '300px'
  };

  // les utilitaires pour l'import export
  private spread: GC.Spread.Sheets.Workbook;
  private excelIO;
  private editableCells: GC.Spread.Sheets.Range[];

  constructor( private readonly _router: Router ){ 
    this.excelIO = new Excel.IO();
    this.editableCells = [];
   }
  
  ngOnInit(): void {}

  columnWidth = 100;

  workbookInit(args){
    this.spread = args.spread;
    let sheet =  this.spread.getActiveSheet();
    //sheet.getCell(0,0).text("cet Individu").foreColor("blue");
    sheet.setRowCount(6);
    this.spread.options.allowUserDragMerge = true;
    
  }

  onClickMe(args) {
    const self = this;
    const json = JSON.stringify(self.spread.toJSON(true));
    const sheet = this.spread.getActiveSheet();
    alert(json);
    let width = this.getColWidthSum(sheet);
    let height = this.getRowHeightSum(sheet);
    this.goToComponentB( 
      { json: json, width: width, height: height, sels : this.editableCells }
      );
  }

  onClickMeImport(args) {
    const file = args.srcElement && args.srcElement.files && args.srcElement.files[0];
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
    
  addColumnBtn(){
    const sheet = this.spread.getActiveSheet();
    sheet.addColumns(sheet.getColumnCount(),1);
  }
  // get the sum of row heights in pixel
  getRowHeightSum(sheet:  GC.Spread.Sheets.Worksheet){
    let height = 0;
    let nbrOfRows = sheet.getRowCount();
    for(let i=0; i<nbrOfRows; i++){
      height += sheet.getRowHeight(i);
    }
    console.log(height);
    return height;
  }
  // get the sum of column widths in pixel
  getColWidthSum(sheet:  GC.Spread.Sheets.Worksheet){
    let width = 0;
    let nbrOfColumns = sheet.getColumnCount();
    for(let i=0; i<nbrOfColumns; i++){
      width += sheet.getColumnWidth(i);
    }
    return width;
  }
  
  setLimitedUse(spread: GC.Spread.Sheets.Workbook){
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

  unlockCells() {
    let sheet = this.spread.getActiveSheet();
    let sels = sheet.getSelections();
    console.log(sels[0]);
    this.editableCells.push(sels[0]);
    
    
  
  }


  deactivateScrolling(sheet: GC.Spread.Sheets.Worksheet){
    const rc = sheet.getRowCount();
    const cc = sheet.getColumnCount();
    sheet.frozenRowCount(rc);
    sheet.frozenColumnCount(cc);
  }
}
