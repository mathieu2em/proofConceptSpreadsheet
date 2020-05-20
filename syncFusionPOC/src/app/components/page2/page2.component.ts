import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-page2',
  templateUrl: './page2.component.html',
  styleUrls: ['./page2.component.scss']
})
export class Page2Component implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }
  editVal:boolean = true;

  changeEdit() {
    this.editVal = !this.editVal;
    console.log(this.editVal);
  } 
}
