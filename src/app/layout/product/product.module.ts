import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProductComponent } from './product.component';
import { ProductRoutingModule } from './product-routing.module';
import { AddProductComponent } from './add-product/add-product.component';
import { DetailsComponent } from './details/details.component';
import { EditComponent } from './edit/edit.component';
import { DataTablesModule } from 'angular-datatables';
import { LogComponent } from './log/log.component';
import { NgxUiLoaderModule } from 'ngx-ui-loader';

@NgModule({
  imports: [
    ProductRoutingModule,
    CommonModule,
    NgbModule,
    FormsModule,
    DataTablesModule,
    NgxUiLoaderModule,
    ReactiveFormsModule
  ],
  declarations: [
      ProductComponent,
      AddProductComponent,
      DetailsComponent,
      EditComponent,
      LogComponent
  ]
  
})
export class ProductModule { }
