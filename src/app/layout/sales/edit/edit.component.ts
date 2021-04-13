import { Component, OnInit } from '@angular/core';
import { SaleService } from 'src/app/shared/services';
import { ActivatedRoute, Router } from '@angular/router';
import { Cached } from 'src/app/shared/providers/data-provider';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit {

  saleToEdit: object = {
    // id: "",
    //   name: "",
    //   added_by:"",
    //   mrp: "",
    //   costprice: "",
    //   quantity: "",
    //   discount: "",
    //   category: "",
    //   subCategory: "",
    //   sold_by:"",
    //   image_path: "",
    //   sold_price:"",
    //   discount_given: ""
  };
  salesList;
  id;
  intermediate;
  lastId;
  image: string | ArrayBuffer;
  message: string;
  startDate;
  saleDate;
  categories;
  subCategories;
  subcategory_id;
  category_id;
  allSubCategories;
  constructor(
    private saleService: SaleService,
    private route: ActivatedRoute,
    private cache: Cached,
    private router: Router
  ) { }

  ngOnInit() {
    this.id = this.route.snapshot['_routerState'].url.toString();
      this.intermediate = this.id.lastIndexOf('/');
      this.lastId = parseInt(this.id.substring(this.intermediate + 1));
      this.salesList = this.cache.sales;
      this.saleToEdit = this.salesList.find(t => t.id == this.lastId);
      this.categories = this.cache.categories;
      this.subCategories = this.cache.subCategories;
      this.allSubCategories = this.subCategories;
      this.saleToEdit['category'] = this.cache.categories.find(t => t['id'] == this.saleToEdit['category_id'])['name'];
      this.saleToEdit['subCategory'] = this.cache.subCategories.find(t => t['id'] == this.saleToEdit['subcategory_id'])['name'];
      console.log(this.categories);
      
      var tempdate = new Date(this.saleToEdit['dateofpurchase']);
      var d = tempdate.getDate();
      var m = tempdate.getMonth() + 1;
      var y = tempdate.getFullYear();
      this.startDate = {
        year: y,
        month: m,
        day: d
      };
      tempdate = new Date(this.saleToEdit['date_of_sale']);
      d = tempdate.getDate();
      m = tempdate.getMonth() + 1;
      y = tempdate.getFullYear();
      this.saleDate = {
        year: y,
        month: m,
        day: d
      };
          
      
  }
  CategorySelected(catId){
    this.subCategories = this.allSubCategories.filter(t => t['category_name'] ==catId);
  }
  UpdateSale(
    id, name, addedby,mrp,costprice, quantity,discount,dateofpurchase,
    category,subcategory,soldby,discountgiven, dateofsale, soldprice
    ){
      this.category_id = this.categories.find(t => t['name'] = category)['id'];
      this.subcategory_id = this.subCategories.find(t => t['name'] = subcategory)['id'];
    this.saleService.updateSale(id, name, addedby,mrp,costprice, quantity,discount,
      dateofpurchase,this.category_id,this.subcategory_id,soldby,discountgiven, dateofsale, 
      soldprice, this.saleToEdit['imagepath'], this.saleToEdit['stock_id']).subscribe(data =>{
        if(data.success){
          this.router.navigate(['/sales',{message: data.message}]);
        }
        else{
          this.message = data.message;
        }
      })
  }
}
