import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { routerTransition } from '../router.animations';
import { UserServiceService } from '../shared/services/user-service.service'
import { delay } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    animations: [routerTransition()]
})
export class LoginComponent implements OnInit {
    isLoginError : boolean = false;
    message: string;
    loginTrue: boolean = false;
    formDisplayed: boolean = true;
    constructor(
        private userService: UserServiceService,
        private translate: TranslateService,
        public router: Router,
        private activatedRoute: ActivatedRoute
        ) {
            this.translate.addLangs(['en', 'fr', 'ur', 'es', 'it', 'fa', 'de', 'zh-CHS']);
            this.translate.setDefaultLang('en');
            const browserLang = this.translate.getBrowserLang();
            this.translate.use(browserLang.match(/en|fr|ur|es|it|fa|de|zh-CHS/) ? browserLang : 'en');
    }

    ngOnInit() {
        this.activatedRoute.paramMap.subscribe(params => {
            let data = params.get('message');
            this.message = data;
        });
    }

    onLoggedin(username, password) {
        this.isLoginError = false;
        this.formDisplayed = false;
        this.loginTrue = true;
        this.userService.userAuthentication(username,password).subscribe((data : any)=>{
            if(data.token != undefined && data.data.email != undefined){
                localStorage.setItem('userToken',data.token);
                localStorage.setItem('email', data.data.email);
                localStorage.setItem('userRole', data.data.role);
                localStorage.setItem('storeId', data.data.store_id);
                this.formDisplayed = true;
            }
            if(data.success == true){
                if(data.data.role == 'admin'||data.data.role == 'sadmin'){
                    this.router.navigate(['/dashboard']);
                }
                else{
                    this.router.navigate(['/sales/stocks']);
                }
            }
            else{
                this.isLoginError = true;
                this.formDisplayed = true;
                this.loginTrue = false;
            }
          },
          (err : HttpErrorResponse)=>{
            this.isLoginError = true;
            this.formDisplayed = true;
            this.loginTrue = false;
          });
    }
}
