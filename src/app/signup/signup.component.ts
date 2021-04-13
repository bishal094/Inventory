import { Component, OnInit } from '@angular/core';
import { routerTransition } from '../router.animations';
import { TranslateService } from '@ngx-translate/core';
import { UserServiceService } from '../shared/services';
import { Router } from '@angular/router';
import { StoreService } from '../shared/services/store.service';

@Component({
    selector: 'app-signup',
    templateUrl: './signup.component.html',
    styleUrls: ['./signup.component.scss'],
    animations: [routerTransition()]
})
export class SignupComponent implements OnInit {
    error: string;
    response;
    mainRole: string = "user";
    message:string;
    isSadmin: boolean;
    stores: Array<object>= [];
    defaultStoreId: number = parseInt(localStorage.getItem('storeId'));
    constructor(private translate: TranslateService,
        private userService: UserServiceService,
        private router: Router,
        private storeService: StoreService
        ) {
        this.translate.addLangs(['en', 'fr', 'ur', 'es', 'it', 'fa', 'de', 'zh-CHS']);
        this.translate.setDefaultLang('en');
        const browserLang = this.translate.getBrowserLang();
        this.translate.use(browserLang.match(/en|fr|ur|es|it|fa|de|zh-CHS/) ? browserLang : 'en');
    }

    ngOnInit() {
        this.isSadmin = this.userService.isSuperAdmin()
        this.storeService.storeList().subscribe(data =>{
            this.stores = data.data
        })
    }

    Register(userName, email, password, confirmPassword){
        
        if(password != confirmPassword){
            this.error = "Passwords Do not match";
        }
        else{
            this.userService.registerUser(email, password, userName, this.mainRole, this.defaultStoreId).subscribe(data => {
                this.response = data
                if(data.success == false){
                    this.error = data.message
                }
                else{
                    this.router.navigate(['/users',{message: data.message}])
                }
            })
        }
        
    }
    changeRole(event){
        this.mainRole = event.target.value;
    }
    StoreSelected(storeId){
        this.defaultStoreId = storeId;
      }
}
