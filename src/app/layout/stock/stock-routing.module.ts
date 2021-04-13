import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { StockComponent } from './stock.component';
import { LogComponent } from './log/log.component';
import { EditComponent } from './edit/edit.component';
import { MoveComponent } from './move/move.component';
import { GodownComponent } from './godown/godown.component';

const routes: Routes = [
    {
        path: '', component: StockComponent
    },
    {
        path: 'log', component: LogComponent
    },
    {
        path: 'edit/:id', component: EditComponent
    },
    {
        path: 'move/:id', component: MoveComponent
    },
    {
        path: 'godownStocks', component: GodownComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class StockRoutingModule {}
