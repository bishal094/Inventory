import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LayoutComponent } from './layout.component';
import { UserComponent } from './user/user.component';
import { RoleGuard } from '../shared/guard/role.guard';

const routes: Routes = [
    {
        path: '',
        component: LayoutComponent,
        children: [
            { path: '', redirectTo: 'dashboard', pathMatch: 'prefix' },
            { path: 'dashboard', loadChildren: './dashboard/dashboard.module#DashboardModule', canActivate: [RoleGuard]},
            // { path: 'charts', loadChildren: './charts/charts.module#ChartsModule' },
            // { path: 'tables', loadChildren: './tables/tables.module#TablesModule' },
            { path: 'forms', loadChildren: './form/form.module#FormModule' },
            // { path: 'bs-element', loadChildren: './bs-element/bs-element.module#BsElementModule' },
            { path: 'grid', loadChildren: './grid/grid.module#GridModule' },
            { path: 'components', loadChildren: './bs-component/bs-component.module#BsComponentModule' },
            // { path: 'blank-page', loadChildren: './blank-page/blank-page.module#BlankPageModule' },
            { path: 'blank-page', loadChildren: './blank-page/blank-page.module#BlankPageModule' },
            { path: 'category', loadChildren: './category/category.module#CategoryModule', canActivate: [RoleGuard] },
            { path: 'subCategory', loadChildren: './sub-category/sub-category.module#SubCategoryModule', canActivate: [RoleGuard] },
            { path: 'product', loadChildren: './product/product.module#ProductModule' },
            { path: 'stores', loadChildren: './store/store.module#StoreModule', canActivate: [RoleGuard] },
            { path: 'stock', loadChildren: './stock/stock.module#StockModule' },
            { path: 'sales', loadChildren: './sales/sales.module#SalesModule' },
            { path: 'signup', loadChildren: '../signup/signup.module#SignupModule', canActivate: [RoleGuard]},
            {
                path: 'users', loadChildren: './user/user.module#UserModule'
            }

        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class LayoutRoutingModule {}
