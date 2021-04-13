import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { DataTablesModule } from 'angular-datatables';
import { UserComponent } from './user.component';
import { UserRoutingModule } from './user-routing.module';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { ChangepasswordComponent } from './changepassword/changepassword.component';

@NgModule({
  declarations: [
    UserComponent,
    ChangepasswordComponent
  ],
  imports: [
    UserRoutingModule,
    CommonModule,
    NgbModule,
    FormsModule,
    DataTablesModule,
    NgxUiLoaderModule
  ]
})
export class UserModule { }
