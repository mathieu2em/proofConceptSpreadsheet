import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title:string = 'syncFusionPOC';
  editVal:boolean = true;

  changeEdit() {
    this.editVal = !this.editVal;
    console.log(this.editVal);
  } 
}

