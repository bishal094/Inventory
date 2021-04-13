import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProductComponent } from './product.component';
import { AddProductComponent } from './add-product/add-product.component';
import { DetailsComponent } from './details/details.component';
import { EditComponent } from './edit/edit.component';
import { LogComponent } from './log/log.component';

const routes: Routes = [
    {
        path: '', component: ProductComponent
    },
    {
        path: 'addProduct', component: AddProductComponent
    },
    {
        path: 'Details/:id', component: DetailsComponent
    },
    {
        path: 'edit/:id', component: EditComponent
    },
    {
        path: 'log', component: LogComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ProductRoutingModule {}
