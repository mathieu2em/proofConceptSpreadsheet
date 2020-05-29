import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { SpreadSheetsModule } from "@grapecity/spread-sheets-angular";
import { Page1Component } from './components/page1/page1.component';
import { Page2Component } from './components/page2/page2.component';
import { SpreadsheetItemComponent } from './components/spreadsheet-item/spreadsheet-item.component';

import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    Page1Component,
    Page2Component,
    SpreadsheetItemComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SpreadSheetsModule,
    FormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
