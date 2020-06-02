import { Component, OnDestroy, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { DataManager, Query } from '@syncfusion/ej2-data';
import { Spreadsheet } from '@syncfusion/ej2-spreadsheet';
import { getComponent } from '@syncfusion/ej2-base';
import { UpdaterService } from '../../services/updater.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-page2',
  templateUrl: './page2.component.html',
  styleUrls: ['./page2.component.scss']
})
export class Page2Component implements OnInit, OnDestroy, AfterViewInit {
  public response: object = {};

  constructor(
    private updaterService: UpdaterService,
    private readonly _router: Router,

    ) { }
    
    public query: Query = new Query().select(['OrderID', 'CustomerID', 'ShipName', 'ShipCity', 'ShipCountry', 'Freight']).take(200);
    
    public data: DataManager = new DataManager({
      url: 'https://js.syncfusion.com/demos/ejServices//wcf/Northwind.svc/Orders',
      crossDomain: true
    });
    
    
    public ngOnInit(): void {}
    
    // Use ref DOM. Encapsulation around the nativeElement
    public ngAfterViewInit(): void {}
    
    public ngOnDestroy(): void {}
    
    // public vu que referee dans un template
    public saveSpreadsheet($event: Event): void {
      // Can access View Child
      this.saveAsJson();
      this.goToComponentA(this.response);
      }

      saveAsJson() {
        let spreadsheet: Spreadsheet = getComponent(document.getElementById("sprd1"), "spreadsheet");
        spreadsheet.saveAsJson().then(Json => (this.response = Json));
        window.alert('Successfully saved');
      }
      
      goToComponentA(passedObj: Object): void {
        this._router.navigate(['/page1'], {state: {data: passedObj}});
      }
    }
