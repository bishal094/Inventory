import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserComponent } from './user.component';
import { ChangepasswordComponent } from './changepassword/changepassword.component';
const routes: Routes = [
    {
        path: '', component: UserComponent
    },
    {
        path: 'changePassword', component: ChangepasswordComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class UserRoutingModule {}
