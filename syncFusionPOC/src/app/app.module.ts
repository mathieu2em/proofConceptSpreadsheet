import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { SpreadsheetAllModule } from '@syncfusion/ej2-angular-spreadsheet';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import {MatButtonModule} from '@angular/material/button';
import { Page1Component } from './components/page1/page1.component';
import { Page2Component } from './components/page2/page2.component';

@NgModule({
  declarations: [
    AppComponent,
    Page1Component,
    Page2Component
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SpreadsheetAllModule,
    MatButtonModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
