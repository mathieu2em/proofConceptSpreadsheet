import * as GC from '@grapecity/spread-sheets';
import '@grapecity/spread-sheets-charts';

export class Spreadsheet {
    id:number;
    title:string;
    jsonData:string;
    width:string;
    height:string;
    sels: GC.Spread.Sheets.Range[];
}