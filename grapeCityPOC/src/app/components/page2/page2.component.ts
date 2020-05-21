import { Component, OnInit } from '@angular/core';
import * as GC from "@grapecity/spread-sheets";

@Component({
  selector: 'app-page2',
  templateUrl: './page2.component.html',
  styleUrls: ['./page2.component.scss']
})
export class Page2Component implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  spreadBackColor = 'aliceblue';
  sheetName = 'people list';
  hostStyle = {
    width: '800px',
    height: '600px'
  };
  data = [
    { Name: 'jean', Category: 'dev', Price: 1, 'Shopping Place': 'edilex' },
    { Name: 'sylvain', Category: 'avocat', Price: 2.01, 'Shopping Place': 'therriencouture' },
    { Name: 'juliette', Category: 'dev', Price: 3.21, 'Shopping Place': 'Other' },
    { Name: 'francis', Category: 'prince', Price: 2, 'Shopping Place': 'edilex' },
    { Name: 'thomas', Category: 'champion', Price: 2, 'Shopping Place': 'edilex' },
    { Name: 'xi jin ping', Category: 'roi', Price: 4, 'Shopping Place': 'Le pays du soleil levant' }
  ];
  columnWidth = 100;

  workbookInit(args){
    let spread:GC.Spread.Sheets.Workbook = args.spread;
    let sheet =  spread.getActiveSheet();
    sheet.getCell(0,0).text("cet Individu").foreColor("blue");
  }
}
