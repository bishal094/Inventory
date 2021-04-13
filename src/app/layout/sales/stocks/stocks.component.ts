import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { StockService } from 'src/app/shared/services/stock.service';
import { UserServiceService, SaleService } from 'src/app/shared/services';
import { Router, ActivatedRoute } from '@angular/router';
import { Cached } from 'src/app/shared/providers/data-provider';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-stocks',
  templateUrl: './stocks.component.html',
  styleUrls: ['./stocks.component.scss']
})
export class StocksComponent implements OnInit {

  stocks: Array<object> = [];
  isCollapsed: boolean = true;
  message: string;
  dtTrigger: Subject<any> = new Subject();
  dtOptions: DataTables.Settings = {};
  tempStock;
  tempMrp: number = 0;
  tempTotal: number = 0;
  fieldsEnabled: boolean = true;
  confirmDisabled: boolean = true;
  storeName:string = "";
  tempDiscount;
  tempQuantity;
  collapse_value = "Show";
  tempGrandTotal: number = 0;
  saleObject: object = {
    name: "",
    sold_price: 0,
    quantity: 0,
    discount_given: 0,
    date_of_sale: "",
    product_id: 0,
    store_id: 0,
    stock_id: 0,
    storeName: ""
  };
  salesData: Array<object> = [];
  styleForQuantity = "";
  styleForDiscount = "";
  DiscountError: string = "";
  QuantityError: string = "";
  PaymentOptions: Array<string> = ["Cash", "Credit/Debit Card", "Cheque"];
  stores;
  storeForBill;
  billAmount:number = 0;
  selectedStoreId;
  canView = false;
  constructor(
    private userService: UserServiceService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private cache: Cached,
    private ngxService: NgxUiLoaderService,
    private sanitizer: DomSanitizer,
    private saleService: SaleService
  ) { }

  ngOnInit() {
    console.log(localStorage.getItem("storeId"));
    
    this.ngxService.start();
    this.ngxService.startLoader('loader-01');
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      processing: true,
      columnDefs: [
        { "orderable": false, "targets": [5,6] }
      ]
    }
    this.canView = this.userService.isSuperAdmin();
    this.saleService.getStockForSale().subscribe(data => {
      console.log(data);
      this.ngxService.stopLoader('loader-01');
      this.ngxService.stop(); 
      if(data.message == 'InvalidToken'){
        this.userService.logoutUser()
        this.router.navigate(['/login',{message: 'Token Expired'}]);
      }
      else{
        if(this.canView){
          this.stores = data.data.stores.filter(t => t.isgodown == 0);
          console.log(this.stores);
          this.selectedStoreId = this.stores[0].id;
          this.stocks = data.data.stocks.filter(t => t.store_id == this.selectedStoreId);
          this.cache.stocks = data.data.stocks;
          this.dtTrigger.next();
          this.stocks.forEach(stock => {
            stock['storeName'] = data.data.stores.find(t => t.id == stock['store_id']).name;
          });
          this.cache.stocks.forEach(stock => {
            stock['storeName'] = data.data.stores.find(t => t.id == stock['store_id']).name;
          });
        }
        else{
          this.stores = data.data.stores;
          this.stocks = data.data.stocks;
          this.cache.stocks = data.data.stocks;
          this.dtTrigger.next();
          this.stocks.forEach(stock => {
            stock['storeName'] = data.data.stores.find(t => t.id == stock['store_id']).name;
          });
          this.cache.stocks.forEach(stock => {
            stock['storeName'] = data.data.stores.find(t => t.id == stock['store_id']).name;
          });
        }
      }
      this.activatedRoute.paramMap.subscribe(params => {
        let message = params.get('message');
        if(message != null){
          this.message = message;
        }
      });
      setTimeout(() => { this.message = null }, 4000);
    });
  }
  AddSale(stock){
    if(this.salesData.find(t => t['stock_id'] == stock['id']) != undefined){
      this.message = "You have already added this to sales"
      setTimeout(() => { this.message = null }, 4000);
    }
    else{
      this.stocks.forEach(stock => {
        stock['selected'] = false;
      });
      this.stocks.find(t => t['id'] == stock['id'])['selected'] = true;
      this.saleObject = new Object;
      this.message = null;
      this.tempStock = stock;
      this.tempMrp = this.tempStock['mrp'];
      this.fieldsEnabled = false;
      this.storeName = "for "+this.tempStock['name']+" in "+ this.tempStock['storeName'];
      this.styleForDiscount = "";
      this.styleForQuantity = "";
      this.tempDiscount = "";
      this.tempTotal = 0;
      this.tempGrandTotal = 0;
    }
    
  }
  DiscountChanged(event: any){
    this.tempDiscount = event.target.value
    var isNum = /^\d+$/.test(this.tempDiscount);
    if(!isNum){
      this.styleForDiscount = "border:2px solid #ff0000";
      this.DiscountError = "(Not a numeric value)";
      this.confirmDisabled = true;
    }
    else if(this.tempDiscount > this.tempStock['discount']){
      this.styleForDiscount = "border:2px solid #ff0000";
      this.DiscountError = "(Value given is higher than max discount)";
      this.confirmDisabled = true;
    }
    else{
      this.styleForDiscount = "";
      this.DiscountError = "";
      this.confirmDisabled = false;
    }
    this.tempTotal = (this.tempMrp * this.tempQuantity); 
    this.tempGrandTotal = this.tempTotal * (1-(this.tempDiscount*0.01))
  }
  QuantityChanged(event: any){
    this.tempQuantity = event.target.value
    var isNum = /^\d+$/.test(this.tempQuantity);
    
    if(!isNum){
      this.styleForQuantity = "border:2px solid #ff0000";
      this.QuantityError = "(Not a numeric value)";
      this.confirmDisabled = true;
    }
    else if(this.tempQuantity > this.tempStock['stock_quantity']){
      this.styleForQuantity = "border:2px solid #ff0000";
      this.QuantityError = "(Quantity higher than availible in stock)";
      this.confirmDisabled = true;
    }
    else{
      this.styleForQuantity = "";
      this.QuantityError = "";
      this.confirmDisabled = false;
    }
    this.tempTotal = (this.tempMrp * this.tempQuantity)
    this.tempGrandTotal = this.tempTotal * (1-(this.tempDiscount*0.01))
  }
  ConfirmSaleData(total, discountGiven, date, qty){
    this.saleObject['name'] = this.tempStock['name'];
    this.saleObject['sold_price'] = total;
    this.saleObject['quantity'] = qty;
    this.saleObject['discount_given'] = discountGiven;
    this.saleObject['date_of_sale'] = date;
    this.saleObject['product_id'] = this.tempStock['product_id'];
    this.saleObject['store_id'] = this.tempStock['store_id'];
    this.saleObject['stock_id'] = this.tempStock['id'];
    this.saleObject['storeName'] = this.tempStock['storeName'];
    if(discountGiven == ""|| date == ""||qty == ""){
      this.message = "Required fields are empty";
      setTimeout(() => { this.message = null }, 4000);
    }
    else{
      this.salesData.push(this.saleObject);
      this.message = "Added to sales list";
      setTimeout(() => { this.message = null }, 4000);
      this.confirmDisabled = false;
      this.stocks.find(t => t['id'] == this.tempStock['id'])['selected'] = false;
      this.tempMrp = 0;
      this.fieldsEnabled = true;
      this.confirmDisabled = true;
      this.storeName = "";
      this.styleForDiscount = "";
      this.styleForQuantity = "";
      this.tempDiscount = "";
      this.tempQuantity = "";
      this.tempTotal = 0;
      this.tempGrandTotal = 0;
    }
  }
  Quantitystyle(){
    return this.sanitizer.bypassSecurityTrustStyle(this.styleForQuantity);
  }
  DiscountStyle(){
    return this.sanitizer.bypassSecurityTrustStyle(this.styleForDiscount);
  }
  RemoveSale(saleItem){
    var self = this;
      bootbox.confirm({
        message: "Are you sure you want to remove this item from sales list?",
        buttons: {
            confirm: {
                label: 'Remove',
                className: 'btn-danger'
            },
            cancel: {
                label: 'Cancel',
                className: 'btn-primary'
            }
        },
        callback: function (result) {
          
          if(result == true){
            self.salesData = self.salesData.filter(t => t['stock_id'] != saleItem['stock_id'])
          }
        }
    });  
  }
  ResetSaleForm(){
    this.stocks.find(t => t['id'] == this.tempStock['id'])['selected'] = false;
    this.tempStock = null;
    this.tempMrp = 0;
    this.fieldsEnabled = true;
    this.confirmDisabled = true;
    this.storeName = "";
    this.styleForDiscount = "";
    this.styleForQuantity = "";
    this.tempDiscount = "";
    this.tempQuantity = "";
    this.tempTotal = 0;
    this.tempGrandTotal = 0;
    this.styleForQuantity = "";
    this.QuantityError = "";
    this.styleForDiscount = "";
    this.DiscountError = "";
  }
  SubmitSalesData(){
    this.billAmount = 0;
    this.salesData.forEach(sale =>{
      this.billAmount += parseInt(sale["sold_price"]);
    })
    if(this.salesData.length != 0){
      var self = this;
      bootbox.confirm(
        "<form id='bill' role='form'>\
          <h2>Bill Info</h2>\
          <div class='row'>\
            <div class='col-lg-6 text-xs-center'>\
              <br>\
              <label>Customer's Name</label>\
              <input id = 'Name' [disabled] = 'false' class='form-control' #Name>\
            </div>\
            <div class='col-lg-6 text-xs-center'>\
              <br>\
              <label>Address</label>\
              <input id='Address' [disabled] = 'false' class='form-control' #MRP ngModel name='MRP' [(ngModel)]='tempMrp'>\
            </div>\
          </div>\
          <br>\
          <div class='row'>\
            <div class='col-lg-6 text-xs-center'>\
              <label>Select payment method</label>\
              <select class='form-control' id = 'PaymentMethod' #PaymentMethod>\
                <option value = 'Cash'>Cash</option>\
                <option value = 'Credit/Debit Card'>Credit/Debit Card</option>\
                <option value = 'Cheque'>Cheque</option>\
              </select>\
            </div>\
            <div class='col-lg-6 text-xs-center'>\
              <label>Card/Cheque number</label>\
              <input id='PaymentNumber' [disabled] = 'false' class='form-control' #PaymentNumber>\
            </div>\
          </div>\
          <br>\
          <div class='row'>\
            <div class='col-lg-6 text-xs-center'>\
              <label>Bill number</label>\
              <input id = 'BillNo' [disabled] = 'false' class='form-control' #Name>\
            </div>\
            <div class='col-lg-6 text-xs-center'>\
              <label>PAN</label>\
              <input id='PAN' [disabled] = 'false' class='form-control' #PAN'>\
            </div>\
          </div>\
          <br>\
          <div class='row'>\
            <div class='col-lg-6 text-xs-center'>\
              <label>Date of sale (YYYY-MM-DD)</label>\
              <input id='DOS' [disabled] = 'false' class='form-control' #DOS>\
            </div>\
            <div class='col-lg-6 text-xs-center'>\
                    <label></label>\
                    <p class='form-control-static'>Grand Total: Rs. "+this.billAmount+"</p>\
                </div>\
          </div>\
        </form>"
    , function(result) {
          if(result){
            var paymentMethod = $('#PaymentMethod').val();
            var payDetail = $('#PaymentNumber').val();
            if(payDetail == ''){
              payDetail = 'N.A';
            }
            var custName = $('#Name').val();
            if(custName == ''){
              var store;
              if(localStorage.getItem("storeId") != "0"){
                store = localStorage.getItem("storeId");
              }
              else{
                store = this.selectedStoreId;
              }
              
              custName = self.stores.find(t => t['id'] == store)['name'];
            }
            var custAddress = $('#Address').val();
            if(custAddress == ''){
              custAddress = 'N.A';
            }
            var custPan = $('#PAN').val();
            if(custPan == ''){
              custPan = 'N.A';
            }
            var dateOfSale = $('#DOS').val();
            var billNo = $('#BillNo').val();
            self.SubmitBill(paymentMethod, payDetail,custName, custAddress, custPan, dateOfSale, billNo);

          }
          });
    }
    else{
      this.message = "Please add items to sell";
      setTimeout(() => { this.message = null }, 4000);
    }
  }
  SubmitBill(paymentMethod, payDetail,custName, custAddress, custPan, dateOfSale, billNo){
    
    if(localStorage.getItem("storeId") != "0"){
      this.storeForBill = localStorage.getItem("storeId");
    }
    else{
      this.storeForBill = this.selectedStoreId;
    }
    console.log(this.storeForBill);
    
    this.saleService.addSale(this.salesData, paymentMethod, payDetail,custName, custAddress, 
      custPan, dateOfSale, billNo, this.storeForBill, this.billAmount).subscribe(data =>{
        console.log(data);
        
        if(data.success == true){
          this.salesData = new Array<Object>();
          this.saleService.getStockForSale().subscribe(data => {
            if(this.canView){
              this.stores = data.data.stores.filter(t => t.isgodown == 0);
              this.stocks = data.data.stocks.filter(t => t.store_id == this.selectedStoreId);
              this.cache.stocks = data.data.stocks;
              this.stocks.forEach(stock => {
                stock['storeName'] = data.data.stores.find(t => t.id == stock['store_id']).name;
              });
              this.cache.stocks.forEach(stock => {
                stock['storeName'] = data.data.stores.find(t => t.id == stock['store_id']).name;
              });
            }
            else{
              this.stores = data.data.stores;
              this.stocks = data.data.stocks;
              this.cache.stocks = data.data.stocks;
              this.dtTrigger.next();
              this.stocks.forEach(stock => {
                stock['storeName'] = data.data.stores.find(t => t.id == stock['store_id']).name;
              });
              this.cache.stocks.forEach(stock => {
                stock['storeName'] = data.data.stores.find(t => t.id == stock['store_id']).name;
              });
            }
          });
        }
        this.message = data.message;
        setTimeout(() => { this.message = null }, 4000);
    })
  }
  ChangeCollapseValue(){
    if(this.isCollapsed == true){
      this.collapse_value = "Show"
    }
    else{
      this.collapse_value = "Hide"
    }
  }
  testFunc(Quantity, MRP){
    console.log(Quantity + MRP);
    
  }
  StoreSelected(value){
    this.selectedStoreId = parseInt(value);
    this.storeForBill = value;
    this.stocks = this.cache.stocks.filter(t => t.store_id == this.storeForBill);
  }
}
