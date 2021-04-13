import { Component, OnInit, ViewChild } from '@angular/core';
import { UserServiceService, SaleService } from 'src/app/shared/services';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { Cached } from 'src/app/shared/providers/data-provider';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { DataTableDirective } from 'angular-datatables';

@Component({
  selector: 'app-sales',
  templateUrl: './sales.component.html',
  styleUrls: ['./sales.component.scss']
})
export class SalesComponent implements OnInit {

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
  isCollapsed: boolean = true;
  constructor(
    private userService: UserServiceService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private saleService: SaleService,
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
        { "orderable": false, "targets": [8,9,10] }
      ]
    }
    this.saleService.getAllSales().subscribe(data => {
      console.log(data);
      
      this.ngxService.stopLoader('loader-01');
      this.ngxService.stop(); 
      this.canView = this.userService.canAccess(); 
      this.sales = data.data.sale;
      this.stores = data.data.stores
      this.cache.sales = data.data.sale;
      this.cache.stores = data.data.stores;
      this.cache.categories = data.data.categories;
      this.cache.subCategories = data.data.subcategories;
      this.categories = data.data.categories;
      this.subCategories = data.data.subcategories;
      this.dtTrigger.next();
      this.sales.forEach(sale => {
        sale['storeName'] = data.data.stores.find(t => t.id == sale['store_id']).name;
      });
      this.activatedRoute.paramMap.subscribe(params => {
        let message = params.get('message');
        if(message != null){
          this.message = message;
        }
      });
      setTimeout(() => { this.message = null }, 4000);
    })
  }
  edit(id){
    this.router.navigate(['/sales/edit',id])
  }
  delete(id){
    var self = this;
      bootbox.confirm({
        message: "Are you sure you want to delete the sale record?",
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
            self.saleService.deleteSale(id).subscribe(data => {
              self.message = data.message;
              if(data.success){
                self.sales = self.sales.filter(t => t['id'] != id)
                setTimeout(() => { self.message = null }, 4000);
              }
            })
          }
        }
    });
  }
  ApplyFilter(product_name, start_date, end_date){
    if(start_date == ""){
      start_date = null
    }
    if(end_date == ""){
      end_date = null
    }
    if(product_name == ""){
      product_name = null
    }
    this.saleService.getSalesByFilter(start_date, end_date,product_name, this.optionsCategory,this.optionsSubCategory).subscribe(data =>{
      if(data.success == false){
        this.message = data.message;
        setTimeout(() => { this.message = null }, 4000);
      }
      else{
        this.sales = data.data.sale;
        this.message = "Filter Applied"
        this.isCollapsed = true;
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
          // Destroy the table first
          dtInstance.destroy();
        });
        // Call the dtTrigger to rerender again
        this.dtTrigger.next();
        setTimeout(() => { this.message = null }, 4000);
      }
    })
  }
}
