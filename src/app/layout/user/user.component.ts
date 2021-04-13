import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { UserServiceService } from 'src/app/shared/services';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {

  dtTrigger: Subject<any> = new Subject();
  dtOptions: DataTables.Settings = {};
  users: Array<object>;
  message: string;
  constructor(
    private router: Router,
    private userService: UserServiceService,
    private activatedRoute: ActivatedRoute,
    private ngxService: NgxUiLoaderService
  ) { }

  ngOnInit() {
    this.ngxService.start();
    this.ngxService.startLoader('loader-01');
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      processing: true
    }
    this.userService.userList().subscribe(data =>{
      this.ngxService.stopLoader('loader-01');
      this.ngxService.stop(); 
      if(data.message == 'InvalidToken'){
        this.userService.logoutUser()
        this.router.navigate(['/login',{message: 'Token Expired'}]);
      }
      else{
        this.users = data.data
        this.dtTrigger.next();
      }
      this.activatedRoute.paramMap.subscribe(params => {
        let message = params.get('message');
        this.message = message;
      });
    })
  }
  Add(){
    this.router.navigate(['/signup']);
  }
}
