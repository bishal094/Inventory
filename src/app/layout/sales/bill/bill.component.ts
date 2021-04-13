import { Component, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { UserServiceService, SaleService } from 'src/app/shared/services';
import { Router, ActivatedRoute } from '@angular/router';
import { Cached } from 'src/app/shared/providers/data-provider';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { BillService } from 'src/app/shared/services/bill.service';
import { StoreService } from 'src/app/shared/services/store.service';

@Component({
  selector: 'app-bill',
  templateUrl: './bill.component.html',
  styleUrls: ['./bill.component.scss']
})
export class BillComponent implements OnInit {

  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  sales: Array<object> = [];
  dtTrigger: Subject<any> = new Subject();
  dtOptions: DataTables.Settings = {};
  message: string;
  stores: Array<object> = [];
  canView;
  optionsSubCategory: any;
  optionsCategory: any;
  categories;
  subCategories;
  selectedStore;
  isCollapsed: boolean = true;
  saleDetail;
  products;
  constructor(
    private userService: UserServiceService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private saleService: SaleService,
    private cache:Cached,
    private ngxService: NgxUiLoaderService,
    private billService: BillService,
    private storeService: StoreService
  ) { }

  ngOnInit() {
    this.ngxService.start();
    this.ngxService.startLoader('loader-01');
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      order: [[ 0, "desc" ]],
      destroy: true,
      processing: true,
      // columnDefs: [
      //   { "orderable": false, "targets": [8,9,10] }
      // ]
    }
    this.canView = this.userService.isSuperAdmin(); 
      if(this.canView){
        this.storeService.storeList().subscribe(data =>{
          this.selectedStore = data.data[0].id;
          console.log(this.selectedStore);
          
          this.stores = data.data;
          this.cache.stores = data.data;
          this.GetBills(this.selectedStore);
        })
      }
      else{
        this.selectedStore = localStorage.getItem("storeId");
        this.GetBills(this.selectedStore);
      }
    this.storeService.storeList().subscribe(data => {
      
      if(data.message == 'InvalidToken'){
        this.userService.logoutUser()
        this.router.navigate(['/login',{message: 'Token Expired'}]);
      }
      else{
        this.stores = data.data;
        this.cache.stores = data.data;
        this.activatedRoute.paramMap.subscribe(params => {
          let data = params.get('message');
          this.message = data;
      });
      }
    })
    // this.billService.getAllbills(null, null, )
  }
  GetBills(storeId, re = true){
    
    
    this.billService.getAllbills(null, null, storeId).subscribe(data =>{
      this.ngxService.stopLoader('loader-01');
      this.ngxService.stop(); 
      console.log(data);
      this.sales = new Array<Object>();
      this.sales = data.data
      if(!re){
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
          dtInstance.destroy();
        });
      }
      this.dtTrigger.next();
    })
    // this.rerender_datatable();
  }
  StoreSelected(id){
    this.GetBills(id, false);
  }
  rerender_datatable() {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.draw();
      // this.dtTrigger.next();
    });
  }
  ApplyFilter(ProductName, StartDate, EndDate){
      this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
        dtInstance.destroy();
      });
      this.billService.getAllbills(StartDate, EndDate, this.selectedStore, ProductName).subscribe(data =>{
        this.message = data.message
        setTimeout(() => { this.message = null }, 4000);
        this.ngxService.stopLoader('loader-01');
        this.ngxService.stop(); 
        console.log(data);
        this.sales = new Array<Object>();
        this.sales = data.data
        this.dtTrigger.next();
    })
    // this.rerender_datatable();

  }
  Details(BillId){
    this.saleDetail = this.sales.find(i => i["id"] == BillId);
    var self = this;
    bootbox.alert("\
    <table class=table>\
              <thead>\
              <tr>\
                  <th>Details</th>\
                  <th></th>\
              </tr>\
              </thead>\
              <tbody>\
                  <tr>\
                        <th scope=row>Customer Name:</th>\
                        <td>"+self.saleDetail["customer_name"]+"</td>\
                  </tr>\
                  <tr>\
                        <th scope=row>Customer Address:</th>\
                        <td>"+self.saleDetail["customer_address"]+"</td>\
                  </tr>\
                  <tr>\
                        <th scope=row>Entered by:</th>\
                        <td>"+self.saleDetail["entered_by"]+"</td>\
                  </tr>\
                  <tr>\
                        <th scope=row>Payment method:</th>\
                        <td>"+self.saleDetail["payment_by"]+"</td>\
                  </tr>\
                  <tr>\
                        <th scope=row>Payment detail:</th>\
                        <td>"+self.saleDetail["payment_by_detail"]+"</td>\
                  </tr>\
                  <tr>\
                        <th scope=row>PAN:</th>\
                        <td>"+self.saleDetail["pan_number"]+"</td>\
                  </tr>\
                  <tr>\
                        <th scope=row>Bill date(YYYY-MM-DD):</th>\
                        <td>"+self.saleDetail["bill_date"].slice(0, 10)+"</td>\
                  </tr>\
                  <tr>\
                        <th scope=row>Bill number:</th>\
                        <td>"+self.saleDetail["bill_number"]+"</td>\
                  </tr>\
                  <tr>\
                        <th scope=row>Total:</th>\
                        <td>NRS "+self.saleDetail["total_price"]+"</td>\
                  </tr>\
              </tbody>\
          </table>\
          ");
  }
  Items(BillId){
    this.router.navigate(['/sales/details',BillId]);
  }
}
