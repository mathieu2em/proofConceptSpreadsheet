// External package imports.
import { Injectable } from '@angular/core';
import { Observable, throwError as _throw, throwError as observableThrowError } from 'rxjs';
import { HttpClient, HttpErrorResponse, HttpResponse } from "@angular/common/http";
import { catchError, map, tap } from "rxjs/operators";

// Application imports.
import { Spreadsheet } from "../models/spreadsheet.model";

@Injectable({
  providedIn: 'root'
})
export class UpdaterService {

  private readonly _spreadsheetUrl: string;

  constructor(private readonly _http: HttpClient) {
    // le url du controlleur pi pour chacunes des actions on va pouvoir agreger a cet url les routes
    this._spreadsheetUrl = "api/spreadsheet";
    console.log("test");

  }

  // PUT /clauses/{id}?updateMode=deleteDraft
  // Publish, Content, Properties, DeleteDraft update action on the clause.
  // `/${clause.id}`
  public saveSpreadsheetApi(data: any, errorContextTitle: string): Observable<any> {
    const body = this.serialize(data); // determiner le contrat d'implem TODO
    const url = this._spreadsheetUrl;

    return this._http.put<any>(
      url,
      body,                      // on peut mapper la reponse pour la transformer la strongly type (changer le any quand jvais savoir le type)
      { observe: "body" }).pipe( // pipe permet de gerer la reponse
        map((item: any) => item, // TODO faire squon veut met quon sait quoi faire lol new Spreadsheet(item)
        tap((item: any) => item, // normalement on veut agir sur nos donnees ( faire un processus si besoin exemple deserialiser )
        catchError((errorResp: HttpErrorResponse) => {
          return observableThrowError(new Error("Web API request failed"));
        })
      )));
  }

  // Serializes a Clause tree into a JSON string.
  public serialize(rootNode: any | null): string | undefined {
    // tslint:disable:max-line-length
    // NOTE: Use a leading comma in the search for property name to ensure they are not found
    //       as substring of another property name. For example, 'id' is found in '...Invalid' !!
    const notSerializedProperties = '';
    if (rootNode != undefined) {
      const retValue = JSON.stringify(
        rootNode,
        (propName: string, propValue: any) => {
          if (propName != undefined && propName.length > 0 && notSerializedProperties.indexOf(`,${propName},`) >= 0) {
            return undefined;
          }
          return propValue;
        });
      return retValue;
    }
    return undefined;
  }
}
