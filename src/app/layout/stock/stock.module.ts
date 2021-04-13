import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StockRoutingModule } from './stock-routing.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { StockComponent } from './stock.component';
import { LogComponent } from './log/log.component';
import { EditComponent } from './edit/edit.component';
import { DataTablesModule } from 'angular-datatables';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { MoveComponent } from './move/move.component';
import { GodownComponent } from './godown/godown.component';

@NgModule({
  declarations: [
    StockComponent,
    LogComponent,
    EditComponent,
    MoveComponent,
    GodownComponent
  ],
  imports: [
    StockRoutingModule,
    CommonModule,
    NgbModule,
    FormsModule,
    DataTablesModule,
    NgxUiLoaderModule
  ]
})
export class StockModule { }
