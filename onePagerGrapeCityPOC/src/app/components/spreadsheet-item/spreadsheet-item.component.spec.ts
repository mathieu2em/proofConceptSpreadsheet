import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpreadsheetItemComponent } from './spreadsheet-item.component';

describe('SpreadsheetItemComponent', () => {
  let component: SpreadsheetItemComponent;
  let fixture: ComponentFixture<SpreadsheetItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpreadsheetItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpreadsheetItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
