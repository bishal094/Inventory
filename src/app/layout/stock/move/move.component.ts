import { Component, OnInit } from '@angular/core';
import { StockService } from 'src/app/shared/services/stock.service';
import { UserServiceService } from 'src/app/shared/services';
import { Router, ActivatedRoute } from '@angular/router';
import { Cached } from 'src/app/shared/providers/data-provider';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
  selector: 'app-move',
  templateUrl: './move.component.html',
  styleUrls: ['./move.component.scss']
})
export class MoveComponent implements OnInit {

  stocks;
  categories;
  subCategories;
  message;
  fromStores;
  toStores;
  allStores;
  id;
  intermediate
  lastId;
  StockToMove;
  StockInStore;
  StoreFrom;
  dataToPush: Array<object> = [];
  isGodown;
  constructor(
    private stockService: StockService,
    private userService: UserServiceService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private cache: Cached,
    private ngxService: NgxUiLoaderService
    ) { }

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe(params => {
      let data = params.get('is_godown');
      this.isGodown = data;
  });
    this.ngxService.start();
    this.ngxService.startLoader('loader-01');
    this.id = this.activatedRoute.snapshot['_routerState'].url.toString();
    this.intermediate = this.id.lastIndexOf('/');
    console.log(this.intermediate);
    
    this.lastId = parseInt(this.id.substring(this.intermediate + 1));
    this.StockToMove = this.cache.stocks.find(t => t.id == this.lastId);
    this.StoreFrom = this.cache.stores.find(t => t['id'] == this.StockToMove['store_id'])['name'];
    this.toStores = this.cache.stores.filter(t => t['id'] != this.StockToMove['store_id'])
    console.log(this.lastId);
    console.log(this.cache.stores);
    
  }
  QuantityChanged(event: any){
    var qty = event.target.value;
    if(qty > this.StockToMove['stock_quantity']){
      this.message = "Specified quantity is not availible in godown"
    }
    else{
      this.message = null;
    }

  }
  AddStoreQuantity(StoreTo, QuantityValue){
    
    if(QuantityValue > this.StockToMove['stock_quantity']){
      this.message = "Specified quantity is not availible in godown"
    }
    else if(QuantityValue == "" || QuantityValue == "0"){
      this.message = "Please provide quantity to move"
    }
    else{
      // var oldStockId;
      this.StockInStore = this.cache.stocks.find(t => t.product_id == this.StockToMove['product_id'] && t.store_id == StoreTo)
      // if(this.StockInStore == undefined){
      //   oldStockId = null;
      // }
      // else{
      //   oldStockId = this.StockInStore['id'];
      //   var dataBody: object = {
      //     stock_id: oldStockId,
      //     store_id: StoreTo,
      //     quantity: parseInt(QuantityValue)
      //   }
      // }
      this.message = null;
      var productToMove = this.StockToMove['product_id'];
      var stockId = this.StockToMove['id'];
      var dataBody: object = {
        store_id: StoreTo,
        quantity: parseInt(QuantityValue)
      }
      this.dataToPush.push(dataBody);
      this.stockService.moveStock(productToMove, stockId, this.dataToPush).subscribe(data => {
        if(data.success == false){
          this.message = data.message
        }
        else if(this.isGodown == 1){
          this.router.navigate(['/stock/godownStocks', {message: data.message}])
        }
        else {
          this.router.navigate(['/stock', {message: data.message}])
        }
      })
    }
  }
}
