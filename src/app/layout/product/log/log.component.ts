import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { ProductService, UserServiceService } from 'src/app/shared/services';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
  selector: 'app-log',
  templateUrl: './log.component.html',
  styleUrls: ['./log.component.scss']
})
export class LogComponent implements OnInit {

  logs: Array<object>;
  dtTrigger: Subject<any> = new Subject();
  dtOptions: DataTables.Settings = {};
  constructor(
    private productService: ProductService,
    private router: Router,
    private userService: UserServiceService,
    private ngxService: NgxUiLoaderService
  ) { }

  ngOnInit() {
    this.ngxService.start();
    this.ngxService.startLoader('loader-01');
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      processing: true,
      columnDefs: [
        { "orderable": false, "targets": 7 }
      ],
      order: [[ 0, "desc" ]]
    }
    this.productService.productLog().subscribe(data => {
      this.ngxService.stopLoader('loader-01');
      this.ngxService.stop(); 
      if(data.message == 'InvalidToken'){
        this.userService.logoutUser()
        this.router.navigate(['/login',{message: 'Token Expired'}]);
      }
      else{
        this.logs = data.data
        console.log(data);
        
        this.dtTrigger.next();
      }
    })
  }

}
