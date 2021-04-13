import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SubCategoryComponent } from './sub-category.component';
import { AddSubCategoryComponent } from './add-sub-category/add-sub-category.component';
import { EditSubCategoryComponent } from './edit-sub-category/edit-sub-category.component';

const routes: Routes = [
    {
        path: '', component: SubCategoryComponent
    },
    {
        path: 'addSubCategory', component: AddSubCategoryComponent
    },
    {
        path: 'edit/:id', component:EditSubCategoryComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class SubCategoryRoutingModule {}
