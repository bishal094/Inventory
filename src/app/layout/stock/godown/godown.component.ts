import { Component, OnInit, ViewChild } from '@angular/core';
import { StockService } from 'src/app/shared/services/stock.service';
import { UserServiceService, SubCategoryService } from 'src/app/shared/services';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { Cached } from 'src/app/shared/providers/data-provider';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { DataTableDirective } from 'angular-datatables';

@Component({
  selector: 'app-godown',
  templateUrl: './godown.component.html',
  styleUrls: ['./godown.component.scss']
})
export class GodownComponent implements OnInit {

  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  stocks: Array<object> = [];
  message: string;
  dtTrigger: Subject<any> = new Subject();
  dtOptions: DataTables.Settings = {};
  isCollapsed: boolean = true;
  categories;
  subCategories;
  optionsSubCategory: any;
  optionsCategory: any;
  godowns;
  godownStocks: Array<object> = [];
  optionsStores;
  Stores;
  constructor(
    private stockService: StockService,
    private userService: UserServiceService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private cache: Cached,
    private ngxService: NgxUiLoaderService,
     private subcategoryService: SubCategoryService
  ) { }

  ngOnInit() {
    this.ngxService.start();
    this.ngxService.startLoader('loader-01');
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      processing: true,
      columnDefs: [
        { "orderable": false, "targets": [6,7,8,9] }
      ]
    }
    this.stockService.stockList().subscribe(data => {
      this.ngxService.stopLoader('loader-01');
      this.ngxService.stop(); 
      if(data.message == 'InvalidToken'){
        this.userService.logoutUser()
        this.router.navigate(['/login',{message: 'Token Expired'}]);
      }
      else{
        this.stocks = data.data.stocks;
        this.godowns = data.data.stores.filter(t => t.isgodown == true);
        this.godowns.forEach(godown => {
          var godownstock = this.stocks.filter(t => t['store_id'] == godown['id'])
          godownstock.forEach(s => {
            this.godownStocks.push(s)
          });
        });
        this.cache.stocks = data.data.stocks;
        this.Stores = data.data.stores.filter(t => t.isgodown == true);
        this.cache.stores = data.data.stores;
        this.cache.categories = data.data.categories;
        this.cache.subCategories = data.data.subcategories;
        this.categories = data.data.categories;
        this.subCategories = data.data.subcategories;
        this.dtTrigger.next();
        this.stocks.forEach(stock => {
          stock['storeName'] = data.data.stores.find(t => t.id == stock['store_id']).name;
          
        });
        this.subcategoryService.getSubCategories().subscribe(data => {
          this.cache.subCategories = data.data;
        })
      }
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
    this.router.navigate(['/stock/edit',id]);
  }
  delete(id){
    var self = this;
      bootbox.confirm({
        message: "Are you sure you want to delete the particular stock in the store?",
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
            self.stockService.deleteStock(id).subscribe(data => {
              self.message = data.message;
              self.stocks = self.stocks.filter(t => t['id'] != id)
              setTimeout(() => { self.message = null }, 4000);
            })
          }
        }
    });  
  }
  AddSale(id){
    this.router.navigate(['/sales/add', id]);
  }
  
  Add(){
    this.router.navigate(['/product/addProduct'])
  }
  ApplyFilter(product_name){
    if(product_name == ""){
      product_name = null
    }
    this.stockService.getStockByFilter(product_name, this.optionsCategory,this.optionsSubCategory,this.optionsStores).subscribe(data =>{
      console.log(data);
      
      if(data.success == false){
        this.message = data.message;
        setTimeout(() => { this.message = null }, 4000);
      }
      else{
        this.stocks = data.data.stocks;
        this.stocks.forEach(stock => {
          stock['storeName'] = data.data.stores.find(t => t.id == stock['store_id']).name;
        });
        this.godowns.forEach(godown => {
          var godownstock = this.stocks.filter(t => t['store_id'] == godown['id'])
          godownstock.forEach(s => {
            this.godownStocks.push(s)
          });
        });
        this.message = "Filter Applied";
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
  Move(id){
    this.router.navigate(['/stock/move',id,{is_godown: 1}]);
  }
}
