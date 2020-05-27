import { Component, OnInit } from '@angular/core';
import * as GC from "@grapecity/spread-sheets";
import * as Excel from '@grapecity/spread-excelio';
import '@grapecity/spread-sheets-charts';
import {saveAs} from 'file-saver';
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

  constructor( private readonly _router: Router ){ this.excelIO = new Excel.IO() }
  
  ngOnInit(): void {}
/*
  data = [
    { Name: 'jean', Category: 'dev', Price: 1, 'Shopping Place': 'edilex' },
    { Name: 'sylvain', Category: 'avocat', Price: 2.01, 'Shopping Place': 'therriencouture' },
    { Name: 'juliette', Category: 'dev', Price: 3.21, 'Shopping Place': 'Other' },
    { Name: 'francis', Category: 'prince', Price: 2, 'Shopping Place': 'edilex' },
    { Name: 'thomas', Category: 'champion', Price: 2, 'Shopping Place': 'edilex' },
    { Name: 'xi jin ping', Category: 'roi', Price: 4, 'Shopping Place': 'Le pays du soleil levant' }
  ];
  */
  columnWidth = 100;

  workbookInit(args){
    const self = this;
    self.spread = args.spread;
    let sheet =  this.spread.getActiveSheet();
    //sheet.getCell(0,0).text("cet Individu").foreColor("blue");
    sheet.setRowCount(6);
  }
  onClickMe(args) {
    const self = this;
    const json = JSON.stringify(self.spread.toJSON(true));
    alert(json);
    this.goToComponentB(json);
  }
  onClickMeImport(args) {
    const self = this, file = args.srcElement && args.srcElement.files && args.srcElement.files[0];
    if (self.spread && file) {
      self.excelIO.open(file, (json) => {
        self.spread.fromJSON(json, {});
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
}
