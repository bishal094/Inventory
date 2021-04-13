import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { NgbDropdownModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { LayoutRoutingModule } from './layout-routing.module';
import { LayoutComponent } from './layout.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { HeaderComponent } from './components/header/header.component';
import { StoreComponent } from './store/store.component';
import { StockComponent } from './stock/stock.component';
import { SalesComponent } from './sales/sales.component';
import { UserComponent } from './user/user.component';
import { DataTablesModule } from 'angular-datatables';
import { RoleGuard } from '../shared/guard/role.guard';

@NgModule({
    imports: [
        CommonModule,
        LayoutRoutingModule,
        TranslateModule,
        NgbDropdownModule,
        DataTablesModule,
        NgbModule
    ],
    declarations: [LayoutComponent, SidebarComponent, HeaderComponent],
    providers: [RoleGuard]
})
export class LayoutModule {}
