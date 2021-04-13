/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { GodownComponent } from './godown.component';

describe('GodownComponent', () => {
  let component: GodownComponent;
  let fixture: ComponentFixture<GodownComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GodownComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GodownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
