import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SalesComponent } from './sales.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { DataTablesModule } from 'angular-datatables';
import { SalesRoutingModule } from './sales-routing.module';
import { EditComponent } from './edit/edit.component';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { StocksComponent } from './stocks/stocks.component';
import { BillComponent } from './bill/bill.component';
import { DetailsComponent } from './details/details.component';

@NgModule({
  declarations: [
    SalesComponent,
    EditComponent,
    StocksComponent,
    BillComponent,
    DetailsComponent
  ],
  imports: [
    SalesRoutingModule,
    CommonModule,
    NgbModule,
    FormsModule,
    DataTablesModule,
    NgxUiLoaderModule
  ]
})
export class SalesModule { }
