import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { StoreRoutingModule } from './store-routing.module';
import { StoreComponent } from './store.component';
import { AddStoreComponent } from './add-store/add-store.component';
import { DataTablesModule } from 'angular-datatables';
import { EditComponent } from './edit/edit.component';
import { NgxUiLoaderModule } from 'ngx-ui-loader';

@NgModule({
  declarations: [
    StoreComponent,
    AddStoreComponent,
    EditComponent
  ],
  imports: [
    CommonModule,
    StoreRoutingModule,
    NgbModule,
    FormsModule,
    DataTablesModule,
    NgxUiLoaderModule
  ]
})
export class StoreModule { }
