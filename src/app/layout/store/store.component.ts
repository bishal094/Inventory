import { Component, OnInit } from '@angular/core';
import { StoreService } from 'src/app/shared/services/store.service';
import { UserServiceService } from 'src/app/shared/services';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { Cached } from 'src/app/shared/providers/data-provider';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
  selector: 'app-store',
  templateUrl: './store.component.html',
  styleUrls: ['./store.component.scss']
})
export class StoreComponent implements OnInit {

  stores: object[];
  message: string;
  dtTrigger: Subject<any> = new Subject();
  dtOptions: DataTables.Settings = {};
  constructor(
    private storeService: StoreService,
    private userService: UserServiceService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private cache:Cached,
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
        { "orderable": false, "targets": [3,4,5 ] }
      ]
    }
    this.storeService.storeList().subscribe(data => {
      this.ngxService.stopLoader('loader-01');
      this.ngxService.stop(); 
      if(data.message == 'InvalidToken'){
        this.userService.logoutUser()
        this.router.navigate(['/login',{message: 'Token Expired'}]);
      }
      else{
        this.stores = data.data;
        this.cache.stores = data.data;
        this.dtTrigger.next();
        this.activatedRoute.paramMap.subscribe(params => {
          let data = params.get('message');
          this.message = data;
      });
      }
    })
  }
  Add(){
    this.router.navigate(['/stores/addStore']);
  }
  edit(id){
    this.router.navigate(['/stores/edit', id]);
  }
  delete(id){
    var self = this;
      bootbox.confirm({
        message: "Are you sure you want to delete the store?",
        buttons: {
            confirm: {
                label: 'Delete',
                className: 'btn-danger'
            },
            cancel: {
                label: 'Cancel',
                className: 'btn-primary'
            }
        },
        callback: function (result) {
          
          if(result == true){
            self.storeService.deleteStore(id).subscribe(data => {
              self.message = data.message;
              if(data.success){
                self.stores = self.stores.filter(t => t['id'] != id)
              }
            })
          }
        }
    });
  }
}
