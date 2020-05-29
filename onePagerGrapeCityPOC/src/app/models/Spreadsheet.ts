import * as GC from '@grapecity/spread-sheets';
import * as Excel from '@grapecity/spread-excelio';
import '@grapecity/spread-sheets-charts';

export class Spreadsheet {
    id:number;
    title:string;
    jsonData:string;
    width:string;
    height:string;
    sels: GC.Spread.Sheets.Range[];
}