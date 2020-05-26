import { Component, OnDestroy, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { SpreadsheetComponent } from '@syncfusion/ej2-angular-spreadsheet';
import { DataManager, Query } from '@syncfusion/ej2-data';
import { UpdaterService } from '../../services/updater.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-page2',
  templateUrl: './page2.component.html',
  styleUrls: ['./page2.component.scss']
})
export class Page2Component implements OnInit, OnDestroy, AfterViewInit {
  //xlObj:Object;
  //( private readonly _spreadSheetService: SpreadSheetService
  constructor(
    private updaterService: UpdaterService,
    private readonly _router: Router,

    ) { }
    
    @ViewChild('edxSpreadsheet') public spreadsheetObj: SpreadsheetComponent;
    
    public query: Query = new Query().select(['OrderID', 'CustomerID', 'ShipName', 'ShipCity', 'ShipCountry', 'Freight']).take(200);
    
    public data: DataManager = new DataManager({
      url: 'https://js.syncfusion.com/demos/ejServices//wcf/Northwind.svc/Orders',
      crossDomain: true
    });
    
    
    public ngOnInit(): void {
      //this.data = this.data;
    }
    
    // Use ref DOM. Encapsulation around the nativeElement
    public ngAfterViewInit(): void {
      /*
      // Can access View Child
      let xlObj = $("#spreadsheet").data("ejSpreadsheet");
      // To save the worksheet on Excel format.
      xlObj.XLExport.export("Excel", "sample");
      */
    }
    
    public ngOnDestroy(): void {
      // this._subscriptions.unsubscribe();
    }
    
    // public vu que referee dans un template
    public saveSpreadsheet($event: Event): void {
      // cest ici quon va appeler le service yeah yeah
      // this._subscriptions.add
      // TODO: private readonly _subcriptions = new Subscription();
      
      // Can access View Child
      const json = this.saveAsJson();
      
      /*
      this.updaterService.saveSpreadsheetApi(json, null)
      .subscribe(
        result => {
          const result2 = result;
          // le result success
          this._router.navigateByUrl('/page1');
        },
        error => {}
        );
        */
      }
      /*
      saveAsFile() {
        var xlObj = $("#spreadsheet").data("ejSpreadsheet");
        xlObj.XLExport["export"](ej.Spreadsheet.exportType.Excel);
      }
      */
      
      //
      private saveAsJson(): any {
        this.spreadsheetObj.saveAsJson()
        .then((obj) => {
          console.log(obj);
          // objet retourne JSON
          this.goToComponentA(obj);

        })
        .finally(() => {
          alert('Promise ready');
        });
      }
      goToComponentA(passedObj: Object): void {
        this._router.navigate(['/page1'], {state: {data: passedObj}});
      }
      
    }
