import * as GC from '@grapecity/spread-sheets';
import '@grapecity/spread-sheets-charts';

export class Spreadsheet {
    id      :number;
    title   :string;
    jsonData:string;                    // excel binary convertis a base64
    width   :string;                    // cellules visibles
    height  :string;                    // ""
    sels    :GC.Spread.Sheets.Range[];  // cellules modifiables
}