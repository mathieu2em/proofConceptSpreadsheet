#!/bin/sh

# before doing this be sure to do habitual Angular CLI project creation
# commands

# see https://ej2.syncfusion.com/angular/documentation/spreadsheet/getting-started/
# for more infos

# install syncfusion
npm install @syncfusion/ej2-angular-spreadsheet --save

# downgrade packages to correct version
npm i @angular/common@9.1.3
npm i @angular/compiler@9.1.3
npm i @angular/core@9.1.3
npm i @angular/forms@9.1.3
npm i @angular/platform-browser@9.1.3
npm i @angular/platform-browser-dynamic@9.1.3
npm i @angular/animations@9.1.3
npm i @angular/router@9.1.3
