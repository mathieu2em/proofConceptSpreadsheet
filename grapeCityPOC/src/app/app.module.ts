import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { SpreadSheetsModule } from "@grapecity/spread-sheets-angular";

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SpreadSheetsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
