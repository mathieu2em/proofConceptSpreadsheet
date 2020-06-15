import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpreadEditorComponent } from './spreadEditor.component';

describe('SpreadEditorComponent', () => {
  let component: SpreadEditorComponent;
  let fixture: ComponentFixture<SpreadEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpreadEditorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpreadEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
