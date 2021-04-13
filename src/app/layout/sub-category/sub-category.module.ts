import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubCategoryRoutingModule } from './sub-category-routing.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SubCategoryComponent } from './sub-category.component';
import { AddSubCategoryComponent } from './add-sub-category/add-sub-category.component';
import { EditSubCategoryComponent } from './edit-sub-category/edit-sub-category.component';
import { FormsModule } from '@angular/forms';
import { DataTablesModule } from 'angular-datatables';
import { NgxUiLoaderModule } from 'ngx-ui-loader';

@NgModule({
  imports: [
    CommonModule,
    SubCategoryRoutingModule,
    NgbModule,
    FormsModule,
    DataTablesModule,
    NgxUiLoaderModule
  ],
  declarations: [
    SubCategoryComponent,
    AddSubCategoryComponent,
    EditSubCategoryComponent
  ]
  
})
export class SubCategoryModule { }
