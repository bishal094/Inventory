import { Component, OnInit } from '@angular/core';
import { StockService } from 'src/app/shared/services/stock.service';
import { UserServiceService } from 'src/app/shared/services';
import { Router, ActivatedRoute } from '@angular/router';
import { Cached } from 'src/app/shared/providers/data-provider';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit {

  stocks;
  StockToEdit: object = {};
  id;
  intermediate;
  lastId;
  message: string;
  isUpdate: boolean = true;
  oldQuantity: number;
  constructor(
    private stockService: StockService,
    private userService: UserServiceService,
    private router: Router,
    private route: ActivatedRoute,
    private cache:Cached
  ) { }

  ngOnInit() {
    this.id = this.route.snapshot['_routerState'].url.toString();
    this.intermediate = this.id.lastIndexOf('/');
    this.lastId = parseInt(this.id.substring(this.intermediate + 1));
    this.StockToEdit = this.cache.stocks.find(t => t.id == this.lastId)
    this.oldQuantity = this.StockToEdit['stock_quantity']
    this.route.paramMap.subscribe(params => {
      let message = params.get('isUpdate');
      if(message == "false"){
        this.isUpdate = false;
        this.StockToEdit['stock_quantity'] = 0
      }
    });
  }
  UpdateStock(stock, newQuantity){
    console.log(newQuantity);
    
    this.stockService.updateStock(stock.id, stock.product_id,stock.store_id, newQuantity).subscribe(data =>{
      if(data.success){
        this.router.navigate(['/stock',{message: data.message}]);
      }
      else{
        this.message = data.message;
      }
    })
  }
  AddAmount(newQuantity){
    newQuantity = parseInt(newQuantity);
    newQuantity += this.oldQuantity;
    this.stockService.updateStock(this.StockToEdit['id'], this.StockToEdit['product_id'],this.StockToEdit['store_id'], newQuantity).subscribe(data =>{
      if(data.success){
        this.router.navigate(['/stock',{message: data.message}]);
      }
      else{
        this.message = data.message;
      }
    })
  }
}
