import { Component, OnInit } from '@angular/core';
import { Product } from 'src/app/shared/model/product.model';
import { ActivatedRoute, Router } from '@angular/router';
import { Category } from 'src/app/shared/model/category.model';
import { SubCategory } from 'src/app/shared/model/subCategory.model';
import { ProductService, CategoryService, SubCategoryService, UserServiceService } from 'src/app/shared/services';
import { Cached } from 'src/app/shared/providers/data-provider';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit {

  id:string;
  lastId: number;
  products: Product[];
  intermediate: number;
  image: string | ArrayBuffer = "";
  product: Product = new Product;
  categories: Array<object>=[];
  allSubCategories: Array<object> = [];
  subCategories: Array<object> = [];
  startDate: object;
  qty: number;
  message: string;
  constructor(private route: ActivatedRoute, 
    private productService: ProductService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private cache: Cached
    ) { }

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe(params => {
      let data = params.get('name');
      if(data!=null){
            this.products = this.cache.products;
            this.id = this.route.snapshot['_routerState'].url.toString();
            this.intermediate = this.id.lastIndexOf('/');
            this.lastId = parseInt(this.id.substring(this.intermediate + 1));
            this.product = this.products.find(t => t.id ==this.lastId);
            console.log(this.product);
            
            var tempdate = new Date(this.product.dateofpurchase);
            var d = tempdate.getDate();
            var m = tempdate.getMonth() + 1;
            var y = tempdate.getFullYear();
            this.startDate = {
              year: y,
              month: m,
              day: d
            };
            this.qty = this.product.quantity;
            this.categories = this.cache.categories;
            this.allSubCategories = this.cache.subCategories;
            this.subCategories = this.allSubCategories;
          }
      
    });
    
  }
  handleFileInput(event){
    let me = this;
    let file = event.target.files[0];
    if(file.size<1048576){
      me.message = ""
      let reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = function () {
        me.image = reader.result;
        console.log(reader.result);
      };
      reader.onerror = function (error) {
        me.message += error;
      };
    }
    else{
      me.image = "Larger";
      me.message = "Please choose a file smaller than 1 MB";
    }
    
  }
  CategorySelected(catId){
    this.subCategories = this.allSubCategories.filter(t => t['category_name'] ==catId);
  }
  UpdateProduct(id, productName, subCategoryName, 
    categoryName, dp, costPrice, mRP, discount){
      var categoryId = this.categories.find(t => t['name'] == categoryName)['id'];
      var subcategoryId = this.allSubCategories.find(t => t['name'] == subCategoryName)['id'];
      this.productService.updateProduct(id, productName, subcategoryId, 
        categoryId, dp, costPrice, mRP, discount, this.qty, this.image).subscribe(data => {
          if(data.success){
            this.router.navigate(['/product',{message: data.message}]);
          }
          else{
            this.message = data.message;
          }
        })
  }

}
