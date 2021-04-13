/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { MoveComponent } from './move.component';

describe('MoveComponent', () => {
  let component: MoveComponent;
  let fixture: ComponentFixture<MoveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MoveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MoveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
