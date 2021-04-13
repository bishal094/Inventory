import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SalesComponent } from './sales.component';
import { EditComponent } from './edit/edit.component';
import { StocksComponent } from './stocks/stocks.component';
import { BillComponent } from './bill/bill.component';
import { DetailsComponent } from './details/details.component';

const routes: Routes = [
    // {
    //     path: '', component: SalesComponent
    // },
    {
        path: '', component: BillComponent
    },
    {
        path: 'edit/:id', component: EditComponent
    },
    {
        path: 'details/:id', component: DetailsComponent
    },
    {
        path: 'stocks', component: StocksComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class SalesRoutingModule {}
