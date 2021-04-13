import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CategoryComponent } from './category.component';
import { AddCategoryComponent } from './add-category/add-category.component';
import { EditComponent } from './edit/edit.component';

const routes: Routes = [
    {
        path: '', component: CategoryComponent
    },
    {
        path: 'addcategory', component: AddCategoryComponent
    },
    {
        path: 'edit/:id', component: EditComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class CategoryRoutingModule {}
