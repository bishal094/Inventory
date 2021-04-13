import { Component, OnInit } from '@angular/core';
import { StockService } from 'src/app/shared/services/stock.service';
import { UserServiceService } from 'src/app/shared/services';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { StoreService } from 'src/app/shared/services/store.service';
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
  stores: Array<object> = [];
  constructor(
    private stockService: StockService,
    private userService: UserServiceService,
    private router: Router,
    private storeService: StoreService,
    private ngxService: NgxUiLoaderService
  ) { 
    
    this.ngxService.start();
    this.ngxService.startLoader('loader-01');
  }

  ngOnInit() {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      order: [[ 0, "desc" ]],
      processing: true
    }
    this.storeService.storeList().subscribe(data =>{
      this.ngxService.stopLoader('loader-01');
      this.ngxService.stop(); 
      this.stores = data['data'];
    })
    this.stockService.stockLog().subscribe(data => {
      if(data.message == 'InvalidToken'){
        this.userService.logoutUser()
        this.router.navigate(['/login',{message: 'Token Expired'}]);
      }
      else{
        this.logs = data.data
        
        
        this.logs.forEach(log => {
          log['storeName'] = this.stores.find(t => t['id'] == parseInt(log['store_id']))['name'];
        });
        this.dtTrigger.next();
      }
    })
  }

}
