import { Component, OnInit } from '@angular/core';
import { Product } from 'src/app/shared/model/product.model';
import { ActivatedRoute, Router } from '@angular/router';
import { EditComponent } from '../edit/edit.component';
import { ProductService, UserServiceService } from 'src/app/shared/services';
import { Cached } from 'src/app/shared/providers/data-provider';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent implements OnInit {

  products : Product[];
  product: Product;
  id: string;
  lastId: number;
  intermediate: number;
  isName : boolean = true;
  isCategory : boolean = true;
  isSubCategory : boolean = true;
  isDOP : boolean = true;
  isMRP : boolean = true;
  isCost : boolean = true;
  isDiscount : boolean = true;
  isQuantity : boolean = true;
  startDate: string;

  constructor(private route: ActivatedRoute, private router: Router, private productService: ProductService,
    private userService: UserServiceService, private cache:Cached) { }

  ngOnInit() {
    this.products = this.cache.products;
        this.id = this.route.snapshot['_routerState'].url.toString();
        this.intermediate = this.id.lastIndexOf('/');
        this.lastId = parseInt(this.id.substring(this.intermediate + 1));
        this.product = this.products.find(t => t.id ==this.lastId);
        
        var tempdate = new Date(this.product.dateofpurchase);
        var d =  (tempdate.getDate());
        var m = tempdate.getMonth() + 1;
        var y = tempdate.getFullYear();
        var dd;
        var mm;
        if(d<10){
          dd='0'+d;
        }
        else{
          dd = d;
        }
        if(m<10){
          mm='0'+m;
        } 
        else{
          mm=m;
        }
        this.startDate = y+"-"+mm+"-"+dd
        if(!this.product.name){
          this.isName = false
        }
        if(!this.product.category){
          this.isCategory = false
        }
        if(!this.product.subcategory){
          this.isSubCategory = false
        }
        if(!this.product.costprice){
          this.isCost = false
        }
        if(!this.product.quantity){
          this.isQuantity = false
        }
        if(!this.product.dateofpurchase){
          this.isDOP = false
        }
        if(!this.product.discount){
          this.isDiscount = false
        }
        if(!this.product.mrp){
          this.isMRP = false
        }
  }
  edit(product: Product){
    this.router.navigate(['/product/edit',product.id,{name: product.name}]);
  }
  delete(product){

  }
}
